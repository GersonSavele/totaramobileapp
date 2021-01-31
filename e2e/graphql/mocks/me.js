/**
 * This file is part of Totara Enterprise.
 *
 * Copyright (C) 2020 onwards Totara Learning Solutions LTD
 *
 * Totara Enterprise is provided only to Totara Learning Solutions
 * LTD’s customers and partners, pursuant to the terms and
 * conditions of a separate agreement with Totara Learning
 * Solutions LTD or its affiliate.
 *
 * If you do not have an agreement with Totara Learning Solutions
 * LTD, you may not access, use, modify, or distribute this software.
 * Please contact [sales@totaralearning.com] for more information.
 */

const defaultMobileMeData = {
  user: {
    id: "53",
    firstname: "Kamala",
    lastname: "Tennakoon",
    fullname: "Kamala Tennakoon",
    lang: "de",
    email: "kamala.tennakoon@totaralearning.com",
    __typename: "core_user"
  },
  system: {
    wwwroot: "https://mobile.demo.totara.software/",
    apiurl: "https://mobile.demo.totara.software/totara/mobile/api.php",
    release: "13.3+ (Build: 20201224.00)",
    request_policy_agreement: false,
    request_user_consent: false,
    request_user_fields: false,
    password_change_required: false,
    view_own_profile: true,
    __typename: "totara_mobile_system"
  },
  __typename: "totara_mobile_me"
};
const defaultMobileMe = {
  totara_mobile_me: () => ({ ...defaultMobileMeData })
};
module.exports = {
  defaultMobileMe
};
