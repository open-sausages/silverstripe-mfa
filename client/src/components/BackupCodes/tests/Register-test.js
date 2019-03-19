/* global jest */

import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Register from '../Register';

Enzyme.configure({ adapter: new Adapter() });

window.ss = {
  i18n: { _t: (key, string) => string },
};

const mockMethod = {
  urlSegment: 'aye',
  name: 'Aye',
  description: 'Register using aye',
  supportLink: 'https://google.com',
  component: 'Test',
};

describe('Register - Recovery Codes', () => {
  it('formats codes putting spaces every 3 (or 4) characters', () => {
    const wrapper = shallow(
      <Register
        method={mockMethod}
        codes={[
          '123', '1234', '12345', '123456', '111222333444', '1112223334444', '11122233334444',
          '111222333444555'
        ]}
      />
    );

    expect(wrapper.instance().getFormattedCodes()).toEqual([
      '123', '1234', '12345', '123 456', '111 222 333 444', '111 222 333 4444', '111 222 3333 4444',
      '111 222 333 444 555'
    ]);
  });

  it('will show a recently copied message when using the copy test button', () => {
    const preventDefault = jest.fn();

    const wrapper = shallow(
      <Register
        method={mockMethod}
        codes={['123', '456']}
      />
    );

    const copyLink = wrapper.find('.mfa-register-backup-codes__copy-to-clipboard');

    expect(copyLink.text()).toBe('Copy codes');
    copyLink.simulate('click', { preventDefault });

    expect(preventDefault.mock.calls).toHaveLength(1);

    wrapper.update();

    expect(wrapper.find('.mfa-register-backup-codes__copy-to-clipboard').text()).toBe('Copied!');
  });

  it('will hide the recently copied message after a short delay', done => {
    const preventDefault = jest.fn();

    const wrapper = shallow(
      <Register
        method={mockMethod}
        codes={['123', '456']}
      />
    );

    const copyLink = wrapper.find('.mfa-register-backup-codes__copy-to-clipboard');

    expect(copyLink.text()).toBe('Copy codes');
    copyLink.simulate('click', { preventDefault });

    expect(preventDefault.mock.calls).toHaveLength(1);

    wrapper.update();

    expect(wrapper.find('.mfa-register-backup-codes__copy-to-clipboard').text()).toBe('Copied!');

    setTimeout(() => {
      expect(wrapper.find('.mfa-register-backup-codes__copy-to-clipboard').text())
        .toBe('Copy codes');
      done();
    }, 3000);
  });

  it('re-copying the codes will reset the recently copied timer', done => {
    const preventDefault = jest.fn();

    const wrapper = shallow(
      <Register
        method={mockMethod}
        codes={['123', '456']}
      />
    );

    const copyLink = wrapper.find('.mfa-register-backup-codes__copy-to-clipboard');

    expect(copyLink.text()).toBe('Copy codes');
    copyLink.simulate('click', { preventDefault });

    expect(preventDefault.mock.calls).toHaveLength(1);

    wrapper.update();

    expect(wrapper.find('.mfa-register-backup-codes__copy-to-clipboard').text()).toBe('Copied!');

    setTimeout(() => {
      expect(wrapper.find('.mfa-register-backup-codes__copy-to-clipboard').text())
        .toBe('Copied!');
      copyLink.simulate('click', { preventDefault });
      expect(preventDefault.mock.calls).toHaveLength(2);
      wrapper.update();
    }, 1500);

    setTimeout(() => {
      expect(wrapper.find('.mfa-register-backup-codes__copy-to-clipboard').text())
        .toBe('Copied!');
      done();
    }, 3000);
  });

  it('will call the given onComplete function when pressing the "finish" button', () => {
    const completeFunction = jest.fn();

    const wrapper = shallow(
      <Register
        method={mockMethod}
        codes={['123', '456']}
        onCompleteRegistration={completeFunction}
      />
    );

    wrapper.find('button').simulate('click');

    expect(completeFunction.mock.calls).toHaveLength(1);
  });
});
