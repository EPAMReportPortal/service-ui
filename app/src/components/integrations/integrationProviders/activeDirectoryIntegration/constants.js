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

const ENABLED_KEY = 'enabled';
export const DOMAIN_KEY = 'domain';
export const LDAP_ATTRIBUTES_KEY = 'ldapAttributes';
export const URL_KEY = 'url';
export const BASE_DN_KEY = 'baseDn';
export const EMAIL_KEY = 'synchronizationAttributes.email';
export const FULL_NAME_KEY = 'synchronizationAttributes.fullName';
export const PHOTO_KEY = 'synchronizationAttributes.photo';

export const LDAP_PREFIX = 'ldap://';
export const LDAPS_PREFIX = 'ldaps://';

export const DEFAULT_FORM_CONFIG = {
  [ENABLED_KEY]: false,
  [LDAP_ATTRIBUTES_KEY]: {
    [URL_KEY]: LDAP_PREFIX,
  },
};
