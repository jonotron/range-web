import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Dropdown } from 'semantic-ui-react';
import UpdateZoneModal from './UpdateZoneModal';
import {
  NO_RUP_PROVIDED, COMPLETED_CONFIRMATION_CONTENT, COMPLETED_CONFIRMATION_HEADER,
  PENDING_CONFIRMATION_CONTENT, PENDING_CONFIRMATION_HEADER,
  DETAIL_RUP_BANNER_CONTENT,
} from '../../constants/strings';
import { EXPORT_PDF } from '../../constants/routes';
import { COMPLETED, PENDING } from '../../constants/variables';
import { Status, ConfirmationModal, Banner } from '../common';
import RupBasicInformation from './RupBasicInformation';
import RupPastures from './RupPastures';

const propTypes = {
  agreement: PropTypes.shape({}).isRequired,
  updateRupStatus: PropTypes.func.isRequired,
  statuses: PropTypes.arrayOf(PropTypes.object).isRequired,
  isDownloadingPDF: PropTypes.bool.isRequired,
  isUpdatingStatus: PropTypes.bool.isRequired,
};

export class RangeUsePlan extends Component {
  constructor(props) {
    super(props);

    // store fields that can be updated within this page
    const { zone, plans } = props.agreement;
    const plan = plans && plans[0];
    const status = plan && plan.status;

    this.state = {
      isCompletedModalOpen: false,
      isPendingModalOpen: false,
      isUpdateZoneModalOpen: false,
      zone,
      status,
      plan,
    };
  }

  onViewPDFClicked = () => {
    const { id, agreementId } = this.state.plan;
    if (id && agreementId) {
      this.pdfLink.click();
    }
  }

  onYesCompletedClicked = () => {
    this.updateStatus(COMPLETED, this.closeCompletedConfirmModal);
  }

  onYesPendingClicked = () => {
    this.updateStatus(PENDING, this.closePendingConfirmModal);
  }

  onZoneClicked = () => {
    this.openUpdateZoneModal();
  }

  onZoneUpdated = (newZone) => {
    this.setState({ zone: newZone });
  }

  setPDFRef = (ref) => { this.pdfLink = ref; }

  updateStatus = (statusName, closeConfirmModal) => {
    const { agreement, statuses: statusReferences, updateRupStatus } = this.props;
    const plan = agreement.plans[0];
    const status = statusReferences.find(s => s.name === statusName);
    if (status && plan) {
      const requestData = {
        planId: plan.id,
        statusId: status.id,
      };
      const statusUpdated = (newStatus) => {
        closeConfirmModal();
        this.setState({
          status: newStatus,
        });
      };
      updateRupStatus(requestData).then(statusUpdated);
    }
  }

  openModal = property => this.setState({ [property]: true })

  closeModal = property => this.setState({ [property]: false })

  openCompletedConfirmModal = () => this.openModal('isCompletedModalOpen')

  closeCompletedConfirmModal = () => this.closeModal('isCompletedModalOpen')

  openPendingConfirmModal = () => this.openModal('isPendingModalOpen')

  closePendingConfirmModal = () => this.closeModal('isPendingModalOpen')

  openUpdateZoneModal = () => this.openModal('isUpdateZoneModalOpen')

  closeUpdateZoneModal = () => this.closeModal('isUpdateZoneModalOpen')

  render() {
    const {
      isCompletedModalOpen,
      isPendingModalOpen,
      isUpdateZoneModalOpen,
      zone = {},
      status = {},
      plan = {},
    } = this.state;
    const { agreement, isUpdatingStatus, isDownloadingPDF } = this.props;
    const statusDropdownOptions = [
      { text: COMPLETED, value: 1, onClick: this.openCompletedConfirmModal },
      { text: PENDING, value: 2, onClick: this.openPendingConfirmModal },
    ];

    const { name: statusName } = status;
    const {
      id,
    } = agreement;

    const rupExist = plan.id;

    return (
      <div className="rup">
        <a
          className="rup__pdf-link"
          target="_blank"
          href={`${EXPORT_PDF}/${id}/${plan.id}`}
          ref={this.setPDFRef}
        >
          pdf link
        </a>

        <UpdateZoneModal
          isUpdateZoneModalOpen={isUpdateZoneModalOpen}
          closeUpdateZoneModal={this.closeUpdateZoneModal}
          onZoneUpdated={this.onZoneUpdated}
          agreementId={id}
          currZone={zone}
        />

        <ConfirmationModal
          open={isCompletedModalOpen}
          header={COMPLETED_CONFIRMATION_HEADER}
          content={COMPLETED_CONFIRMATION_CONTENT}
          onNoClicked={this.closeCompletedConfirmModal}
          onYesClicked={this.onYesCompletedClicked}
          loading={isUpdatingStatus}
        />

        <ConfirmationModal
          open={isPendingModalOpen}
          header={PENDING_CONFIRMATION_HEADER}
          content={PENDING_CONFIRMATION_CONTENT}
          onNoClicked={this.closePendingConfirmModal}
          onYesClicked={this.onYesPendingClicked}
          loading={isUpdatingStatus}
        />

        <Banner
          header={id}
          content={rupExist ? DETAIL_RUP_BANNER_CONTENT : NO_RUP_PROVIDED}
          actionClassName={rupExist ? 'rup__actions' : 'rup__actions--hidden'}
        >
          <Status
            className="rup__status"
            status={statusName}
          />
          <div>
            <Button
              onClick={this.onViewPDFClicked}
              className="rup__btn"
              loading={isDownloadingPDF}
            >
              View PDF
            </Button>
            { statusName !== COMPLETED &&
              <Dropdown
                className="rup__status-dropdown"
                text="Update Status"
                options={statusDropdownOptions}
                button
                item
              />
            }
          </div>
        </Banner>

        <div className="rup__content">
          <RupBasicInformation
            className="rup__basic_information"
            agreement={agreement}
            plan={plan}
            zone={zone}
            onZoneClicked={this.onZoneClicked}
          />

          <RupPastures
            className="rup__pastures"
            plan={plan}
          />
        </div>
      </div>
    );
  }
}

RangeUsePlan.propTypes = propTypes;
export default RangeUsePlan;
