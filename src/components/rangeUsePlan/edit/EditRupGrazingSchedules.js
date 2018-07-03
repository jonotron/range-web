import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Dropdown } from 'semantic-ui-react';
import { NOT_PROVIDED } from '../../../constants/strings';
import EditRupGrazingSchedule from './EditRupGrazingSchedule';
import { ELEMENT_ID, REFERENCE_KEY } from '../../../constants/variables';
import { deleteRupSchedule, deleteRupScheduleEntry } from '../../../actionCreators';
import * as utils from '../../../utils';

const propTypes = {
  plan: PropTypes.shape({ grazingSchedules: PropTypes.array }).isRequired,
  pasturesMap: PropTypes.shape({}).isRequired,
  grazingSchedulesMap: PropTypes.shape({}).isRequired,
  grazingScheduleEntriesMap: PropTypes.shape({}).isRequired,
  references: PropTypes.shape({}).isRequired,
  usages: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export class EditRupGrazingSchedules extends Component {
  constructor(props) {
    super(props);

    this.state = {
      yearOptions: this.getInitialYearOptions(),
      activeScheduleIndex: 0,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { plan, grazingSchedulesMap } = nextProps;
    const scheduleChanged = this.props.plan.grazingSchedules !== plan.grazingSchedules;
    if (scheduleChanged) {
      const newYearOptions = plan.grazingSchedules.map((id) => {
        const s = grazingSchedulesMap[id];

        return {
          key: s.year,
          text: s.year,
          value: s.year,
        };
      });
      this.setState({ yearOptions: newYearOptions });
    }
  }

  getInitialYearOptions = () => {
    const { plan, grazingSchedulesMap } = this.props;
    const { planStartDate, planEndDate, grazingSchedules: grazingScheduleIds } = plan || {};
    if (planStartDate && planEndDate) {
      // set up year options
      const planStartYear = new Date(planStartDate).getFullYear();
      const planEndYear = new Date(planEndDate).getFullYear();
      const length = (planEndYear - planStartYear) + 1;
      return utils.createEmptyArray(length)
        .map((v, i) => (
          {
            key: planStartYear + i,
            text: planStartYear + i,
            value: planStartYear + i,
          }
        ))
        .filter((option) => {
          // give year options that hasn't been added yet in schedules
          const grazingSchedules = grazingScheduleIds.map(id => grazingSchedulesMap[id]);
          const years = grazingSchedules.map(s => s.year);
          return !(years.indexOf(option.value) >= 0);
        });
    }
    return [];
  }

  onScheduleClicked = (scheduleIndex) => {
    const newIndex = this.state.activeScheduleIndex === scheduleIndex ? -1 : scheduleIndex;

    this.setState({ activeScheduleIndex: newIndex });
  }

  scheduleCopied = (year, newGrazingScheduleId) => {
    // grazingSchedules.sort((s1, s2) => s1.year > s2.year);
    // const { grazingSchedules } = this.props.plan;
    // const activeScheduleIndex = grazingSchedules.findIndex(id => id === newGrazingScheduleId);
    // console.log(this.props.plan)
    // // remove this year from the year options
    this.setState({
      yearOptions: this.state.yearOptions.filter(o => o.value !== year),
      // activeScheduleIndex,
    });
  }

  renderSchedule = (schedule, scheduleIndex) => {
    const {
      plan,
      usages,
      references,
      pasturesMap,
      grazingScheduleEntriesMap,
    } = this.props;
    const { yearOptions, activeScheduleIndex } = this.state;
    const grazingScheduleEntries = utils.getObjValues(grazingScheduleEntriesMap);
    const { id, year } = schedule;
    const yearUsage = usages.find(u => u.year === year);
    const authorizedAUMs = (yearUsage && yearUsage.authorizedAum) || 0;
    const livestockTypes = references[REFERENCE_KEY.LIVESTOCK_TYPE];
    const crownTotalAUMs = utils.calcCrownTotalAUMs(grazingScheduleEntries, pasturesMap, livestockTypes);

    return (
      <EditRupGrazingSchedule
        key={id}
        yearOptions={yearOptions}
        plan={plan}
        schedule={schedule}
        scheduleIndex={scheduleIndex}
        grazingScheduleEntriesMap={grazingScheduleEntriesMap}
        onScheduleClicked={this.onScheduleClicked}
        activeScheduleIndex={activeScheduleIndex}
        livestockTypes={livestockTypes}
        pasturesMap={pasturesMap}
        authorizedAUMs={authorizedAUMs}
        crownTotalAUMs={crownTotalAUMs}
        scheduleCopied={this.scheduleCopied}
      />
    );
  }
  render() {
    const { yearOptions } = this.state;
    const { plan, grazingSchedulesMap } = this.props;
    const { grazingSchedules: grazingScheduleIds } = plan;
    const grazingSchedules = grazingScheduleIds.map(id => grazingSchedulesMap[id]);
    return (
      <div className="rup__schedules__container" id={ELEMENT_ID.GRAZING_SCHEDULE}>
        <div className="rup__title--editable">
          <div>Yearly Schedules</div>
          <Dropdown
            className="icon"
            text="Add Schedule"
            header="Years"
            icon="add"
            basic
            labeled
            button
            item
            options={yearOptions}
            disabled={yearOptions.length === 0}
            onChange={this.onYearSelected}
            selectOnBlur={false}
            pointing
          />
        </div>
        <div className="rup__divider" />
        <ul className={classnames('rup__schedules', { 'rup__schedules--empty': grazingSchedules.length === 0 })}>
          {
            grazingSchedules.length === 0 ? (
              <div className="rup__section-not-found">{NOT_PROVIDED}</div>
            ) : (
              grazingSchedules.map(this.renderSchedule)
            )
          }
        </ul>
      </div>
    );
  }
}

EditRupGrazingSchedules.propTypes = propTypes;
export default connect(null, { deleteRupSchedule, deleteRupScheduleEntry })(EditRupGrazingSchedules);
