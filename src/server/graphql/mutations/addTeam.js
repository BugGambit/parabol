import {GraphQLList, GraphQLNonNull} from 'graphql';
import addTeamInvitees from 'server/graphql/mutations/helpers/addTeamInvitees';
import createTeamAndLeader from 'server/graphql/mutations/helpers/createTeamAndLeader';
import AddTeamPayload from 'server/graphql/types/AddTeamPayload';
import Invitee from 'server/graphql/types/Invitee';
import NewTeamInput from 'server/graphql/types/NewTeamInput';
import {auth0ManagementClient} from 'server/utils/auth0Helpers';
import {getUserId, getUserOrgDoc} from 'server/utils/authorization';
import publish from 'server/utils/publish';
import sendSegmentEvent from 'server/utils/sendSegmentEvent';
import shortid from 'shortid';
import {NEW_AUTH_TOKEN, NOTIFICATION, TEAM, UPDATED} from 'universal/utils/constants';
import toTeamMemberId from 'universal/utils/relay/toTeamMemberId';
import addTeamValidation from './helpers/addTeamValidation';
import {sendOrgAccessError} from 'server/utils/authorizationErrors';
import sendFailedInputValidation from 'server/utils/sendFailedInputValidation';

export default {
  type: AddTeamPayload,
  description: 'Create a new team and add the first team member',
  args: {
    newTeam: {
      type: new GraphQLNonNull(NewTeamInput),
      description: 'The new team object'
    },
    invitees: {
      type: new GraphQLList(new GraphQLNonNull(Invitee))
    }
  },
  async resolve (source, args, {authToken, dataLoader, socketId: mutatorId}) {
    const operationId = dataLoader.share();
    const subOptions = {mutatorId, operationId};

    // AUTH
    const {orgId} = args.newTeam;
    const viewerId = getUserId(authToken);
    const userOrgDoc = await getUserOrgDoc(viewerId, orgId);
    if (!userOrgDoc) return sendOrgAccessError(authToken, orgId);

    // VALIDATION
    const {
      data: {invitees, newTeam},
      errors
    } = addTeamValidation()(args);
    if (Object.keys(errors).length) {
      return sendFailedInputValidation(authToken, errors);
    }

    // RESOLUTION
    const teamId = shortid.generate();
    await createTeamAndLeader(viewerId, {id: teamId, ...newTeam});

    const tms = authToken.tms.concat(teamId);
    const inviteeCount = invitees ? invitees.length : 0;
    sendSegmentEvent('New Team', viewerId, {orgId, teamId, inviteeCount});
    publish(NEW_AUTH_TOKEN, viewerId, UPDATED, {tms});
    auth0ManagementClient.users.updateAppMetadata({id: viewerId}, {tms});

    const {invitationIds, teamInviteNotifications} = await addTeamInvitees(
      invitees,
      teamId,
      viewerId,
      dataLoader
    );
    const teamMemberId = toTeamMemberId(teamId, viewerId);
    const data = {
      orgId,
      teamId,
      teamMemberId,
      invitationIds,
      teamInviteNotifications
    };

    teamInviteNotifications.forEach((notification) => {
      const {
        userIds: [invitedUserId]
      } = notification;
      publish(NOTIFICATION, invitedUserId, AddTeamPayload, data, subOptions);
    });
    publish(TEAM, viewerId, AddTeamPayload, data, subOptions);

    return data;
  }
};
