import React from 'react'
import {mount} from 'enzyme'

import CronBuilder from './CronBuilder'
import Tab from './components/Tab'
import PeriodicallyTab from './components/PeriodicallyTab'
import PeriodicallyFrameTab from './components/PeriodicallyFrameTab'
import FixedTimeTab from './components/FixedTimeTab'
import {EVERY, MINUTES} from '../data/constants'

describe('CronBuilder', () => {
    it('initial render', () => {
        const wrapper = mount(<CronBuilder />);
        expect(wrapper.find('legend').find(Tab)).toHaveLength(3);
        expect(wrapper.find(PeriodicallyTab)).toHaveLength(1);
    });

    it('should parse expression', () => {
        const wrapper = mount(<CronBuilder
            cronExpression="5,15,25 */2 * * 1-5"
        />);
        expect(wrapper.instance().presetComponent.state).toEqual({
            minutes: ['5', '15', '25'],
            hours: '2',
            dayOfWeek: '1-5',
            dayOfMonth: EVERY,
            month: EVERY,
            activeTime: MINUTES,
            minutesMultiple: true,
            hoursMultiple: false
        });
    });

    it('should call onChange', () => {
        const onChange = jest.fn();
        const expression = '5,15,25 */2 5,6 5 1-5';
        const wrapper = mount(<CronBuilder
            cronExpression={expression}
            onChange={onChange}
        />);
        wrapper.find('[data-action]').simulate('click');
        expect(onChange).toHaveBeenCalledWith(expression)
    });

    it('should set active tab 1', () => {
        const wrapper = mount(<CronBuilder
            cronExpression={'25 17-21 4 2 6-7'}
        />);
        expect(wrapper.instance().presetComponent.state).toEqual({
            minutes: '25',
            hours: '17-21',
            hoursFrom: '17',
            hoursTo: '21',
            dayOfWeek: '6-7',
            dayOfMonth: '4',
            month: '2',
            activeTime: MINUTES,
            minutesMultiple: false,
            hoursMultiple: false
        });
        expect(wrapper.state().activeIndex).toEqual(1);
    });

    it('should switch tabs', () => {
        const wrapper = mount(<CronBuilder />);
        wrapper.find('legend').find(Tab).at(1).simulate('click');
        expect(wrapper.find(PeriodicallyFrameTab)).toHaveLength(1);
        wrapper.find('legend').find(Tab).at(2).simulate('click');
        expect(wrapper.find(FixedTimeTab)).toHaveLength(1);
    });

    it('should correctly set state for the 3rd tab', () => {
        const wrapper = mount(<CronBuilder
            cronExpression={'48 6 24 6 2'}
        />);
        wrapper.find('legend').find(Tab).at(2).simulate('click');
        expect(wrapper.instance().presetComponent.state).toEqual({
            minutes: '48',
            hours: '6',
            dayOfWeek: '2',
            dayOfMonth: '24',
            month: '6',
            activeTime: MINUTES,
            minutesMultiple: true,
            hoursMultiple: true
        });
    })
});
