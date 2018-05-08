import PropTypes from 'prop-types';
import React from 'react';
import portal from 'react-portal-hoc';
import Button from 'universal/components/Button/Button';
import {DashModal} from 'universal/components/Dashboard';
import Type from 'universal/components/Type/Type';
import withAtmosphere from 'universal/decorators/withAtmosphere/withAtmosphere';
import RemoveOrgUserMutation from 'universal/mutations/RemoveOrgUserMutation';
import withMutationProps from 'universal/utils/relay/withMutationProps';
import {withRouter} from 'react-router-dom';

const LeaveOrgModal = (props) => {
  const {
    atmosphere,
    closeAfter,
    closePortal,
    history,
    location,
    isClosing,
    submitting,
    submitMutation,
    onCompleted,
    onError,
    orgId,
    userId
  } = props;
  const handleClick = () => {
    submitMutation();
    RemoveOrgUserMutation(atmosphere, {orgId, userId}, {history, location}, onError, onCompleted);
  };
  const undoStr = 'To undo it, you’ll have to ask another Billing Leader to re-add you';
  return (
    <DashModal closeAfter={closeAfter} closePortal={closePortal} isClosing={isClosing} onBackdropClick={closePortal}>
      <Type align="center" bold marginBottom="1.5rem" scale="s7" colorPalette="warm">
        Are you sure?
      </Type>
      <Type align="center" bold marginBottom="1.5rem" scale="s4">
        This will remove you from the organization and all teams under it! <br />
        {undoStr}<br />
      </Type>
      <Button
        buttonStyle="flat"
        colorPalette="warm"
        icon="arrow-circle-right"
        iconPlacement="right"
        label={'Leave the organization'}
        onClick={handleClick}
        buttonSize="large"
        waiting={submitting}
      />
    </DashModal>
  );
};

LeaveOrgModal.propTypes = {
  atmosphere: PropTypes.object.isRequired,
  closeAfter: PropTypes.number,
  closePortal: PropTypes.func,
  isClosing: PropTypes.bool,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  orgId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  submitting: PropTypes.bool,
  submitMutation: PropTypes.func.isRequired,
  onCompleted: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired
};

export default withRouter(withAtmosphere(withMutationProps(portal({escToClose: true, closeAfter: 100})(LeaveOrgModal))));
