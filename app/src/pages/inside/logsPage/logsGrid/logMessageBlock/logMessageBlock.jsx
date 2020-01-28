/*
 * Copyright 2019 EPAM Systems
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { dateFormat } from 'common/utils';
import { MarkdownViewer } from 'components/main/markdown';
import styles from './logMessageBlock.scss';

const cx = classNames.bind(styles);
const MARKDOWN_MODE = '!!!MARKDOWN MODE!!!';

export class LogMessageBlock extends Component {
  static propTypes = {
    value: PropTypes.object.isRequired,
    customProps: PropTypes.object,
    refFunction: PropTypes.func,
  };

  static defaultProps = {
    customProps: {},
    refFunction: null,
  };

  render() {
    const { value, refFunction, customProps } = this.props;
    const markdownModeRegExp = new RegExp(MARKDOWN_MODE, 'g');
    const messageWithoutMarkdown = value.message.replace(markdownModeRegExp, '');

    return (
      <div ref={refFunction} className={cx('log-message-block')}>
        {customProps.consoleView && <span className={cx('time')}>{dateFormat(value.time)}</span>}
        {customProps.markdownMode ? (
          <MarkdownViewer value={messageWithoutMarkdown} />
        ) : (
          <div className={cx('log-message')}>{messageWithoutMarkdown}</div>
        )}
      </div>
    );
  }
}
