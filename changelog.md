Totara Mobile App Changelog

Release 1.0.10 (17th May 2021):
=====================================

Bug
[MOB-911] - SCORM content not displayed in landscape view in mobile app
[MOB-905] - Course sections without activities
[MOB-922] - Loading spinner in Course details is not working
[MOB-923] - Tapping on a PN pop up doesn't go to the target notification
[MOB-904] - Cannot open link within PDF file on Android devices

Task
[MOB-900] - Language in Mobile app seems to be dependant on language detection
[MOB-912] - Investigate why some SCORM packages are not navigable on Webviews

Improvements
[MOB-796] - Refine focus order in all screens(Discovery)
[MOB-819] - Embedded Media(Audio/Video) should show in the inline-player
[MOB-895] - Mocked server for Native login flow

Technical documentation
[MOB-919] - Improve release documentation

Release 1.0.9 (30th March 2021):
=====================================

Bug
[MOB-804] - File view does not trigger completion in Totara Mobile
[MOB-901] - Statusbar color does not return to default color when switching tabs
[MOB-910] - iOS app should receive push notification
[MOB-915] - SCORM type activity does not save state or register attempt in the app

Improvement
[MOB-870] - Implement Detox test cases for scorm
[MOB-879] - Detox with mocked server for Current Learning
[MOB-888] - Remove LinkMedia description in WekaViewEditor
[MOB-898] - Move testing credentials to local config file
[MOB-903] - If the mobile app is logged out of any downloaded SCORMs are deleted.

Technical documentation
[MOB-887] - Review technical documentation on the mobile side for PN

Release 1.0.8 (05th March 2021):
=====================================

Bug
[MOB-883] - In-app notification not appearing until bell icon is selected and refresh the list
[MOB-893] - Activities should not crash when the list of activities has a video
[MOB-891] - Force password change does not redirect user to browser and prevents login to Totara Mobile app

Improvement
[MOB-882] - Reshape Learning Details header
[MOB-885] - Images added in the WEKA text editor do not scale down correctly when viewed on the mobile app
[MOB-890] - Use `fullmessageHTML` field in notifications when the format is HTML

Release 1.0.7 (29th January 2021):
=====================================
Bug
[MOB-880] - translations falls back to english

Release 1.0.6 (20th January 2021):
=====================================
Bug
[MOB-380] - Change password while using the app
[MOB-749] - Should return keyboard while showing Incompatible site url modal
[MOB-775] - Tertiary button colour is not aligned with the design
[MOB-860] - New line on current learning cards should respect case from HTML text editor
[MOB-873] - List icon on the carousel/list switch should be rounded
[MOB-877] - Language strings are not being translated
[MOB-875] - Make languages installation script work on Windows

Task
[MOB-874] - Environment updates should be capable of project installation

Improvement
[MOB-654] - Activity sheet transition
[MOB-683] - Refactor theme within the code to map to style guide
[MOB-684] - Use native navigation elements where possible
[MOB-822] - Check message format for Notifications details
[MOB-841] - Set up webview in notification details so I can see the notification content
[MOB-853] - Implement Detox test cases for programs/certification
[MOB-854] - Implement Detox test cases for user profile
[MOB-872] - (Discovery) Detox work with mock data instead of real API data

Release 1.0.5 (17th December 2020):
=====================================

Bug
[MOB-859] - Cannot download SCORM activity after you submit answers
[MOB-861] - Couser layout should remains as expected when switch back from landscape activities

Task
[MOB-813] - Check for copied code that doesn’t comply with our licenses
[MOB-865] - Upload release 1.0.4 to beta distribution(testflight/Gplay)
[MOB-867] - Upload release 1.0.5 to beta distribution(testflight/Gplay)

Improvement
[MOB-620] - In-App notifications auto refresh
[MOB-792] - Layout is broken when font size is changed
[MOB-794] - No voice over for manual and auto completion check boxes
[MOB-795] - No voice over for download icon in SCORm summary screen
[MOB-797] - Accessibility property for all the images
[MOB-823] - Set up react navigation library compatibility module
[MOB-850] - Implement Detox test cases for authentication
[MOB-851] - Implement Detox test cases for current learning ( iOS set up only )
[MOB-858] - Update header of API calls to use X-API-Key instead of authorisation header
[MOB-864] - Reset badge in the App icon when reading a notification

Release 1.0.4 (3rd December 2020):
=====================================

Bug
[MOB-855] - Notifications list must update time automatically

Improvement
[MOB-475] - App Internal/external Distribution change
[MOB-620] - In-App notifications auto refresh
[MOB-682] - Refine tabs
[MOB-721] - UI - Pressed state for cards
[MOB-791] - No voice over for the current learning switch
[MOB-793] - No voice over for expand all switch
[MOB-794] - No voice over for manual and auto completion check boxes
[MOB-848] - Run Axe report to check the accessibility issues
[MOB-850] - Implement Detox test cases for authentication
[MOB-851] - Implement Detox test cases for current learning

Release 1.0.3 (18th November 2020):
=====================================

Bug  
[MOB-834] - Images/Icons not showing on iOS 14 devices

Task
[MOB-561] - [Discovery] Orientation Portrait/Landscape

Improvement  
[MOB-778] - Summary Weka text should be shown in the current learning cards
[MOB-836] - App updates must target Android 10 (API level 29) or higher
[MOB-840] - Enable dynamic orientation for all activities

Release 1.0.0 (23th September 2020):
=====================================

Bug  
[MOB-753] - Single activity course UI refinements  
[MOB-757] - Activity should stay as expanded after user tap on manual completion  
[MOB-765] - Learning item summary text should show tidied up in the carousel item  
[MOB-768] - Course from a course set is not being loaded  
[MOB-773] - Show loading for the pdf activity  

Improvement  
[MOB-751] - Use semantic version to communicate min version  
[MOB-779] - Upload release 1.0.0 to beta distribution(testflight/Gplay)  


Release 0.29 (09th September 2020):
=====================================

Bug  
[MOB-625] - Unable to view files within webview (Android only) - no Mimetype in API  
[MOB-728] - Downloads not being cleared when user logouts  
[MOB-736] - Activity text colour is changing every time when user tap on them (even there is no action for them)  
[MOB-739] - Learning items should not be repeated in the current learning  
[MOB-742] - Empty(Null) Course group is not delt in the App and crashes the App - Sentry reports  
[MOB-758] - Course details not working because ids have changed  

New Feature  
[MOB-676] - Cache last URL used to authenticate into the app  
[MOB-699] - Send token to the server  
[MOB-700] - Direct users to notifications list in the app  

Task  
[MOB-730] - Remove sentryUri from main config.ts to config.local.ts  

Improvement  
[MOB-415] - Every activity collapse/expand in Course UI  
[MOB-512] - Swap licenses  
[MOB-685] - Enter URL Screen: Move forgot password link below enter button  
[MOB-690] - Exit icon on SCORM summary screen should be consistent with other exit icons  
[MOB-710] - Program and Cert view more link  
[MOB-716] - UI - Default image size is not consistent  
[MOB-722] - Empty state for "All attempts grades screen"  
[MOB-727] - CourseSet: add course progress bar  


Release 0.28 (26th August 2020):
=====================================

Bug  
[MOB-658] - Status bar content colour  
[MOB-695] - Android: Progress circle is cut off by the next card  
[MOB-711] - Android: Get started ui will collapse when scroll-up key board  
[MOB-712] - increase row height in the the list view of profile(very hard to press)  
[MOB-713] - Default images' borders not being applied when the listing orientation is selected  
[MOB-717] - UI - Due date overlap  
[MOB-720] - Course image is not updating  
[MOB-725] - Online scorm player dropped connection should show cached Scorm summary  

Improvement  
[MOB-273] - Version negotiation after site url screen (before login) part 2  
[MOB-662] - SCORM: UX Issues  
[MOB-667] - Replace mobile imagery  
[MOB-686] - Remove borders on all cards in the app  
[MOB-689] - Current Learning: Responsive texts  
[MOB-703] - Adjust Offline message and confirm UX when it appears  
[MOB-705] - Notify user, for any activity, when the user goes offline. [DESCOPED - see comments]  
[MOB-709] - Upgrade react-native-webview  
[MOB-715] - UI - Modal height refinement  
[MOB-750] - Use build number version to communicate min version [ temporary measure ]  

Technical documentation  
[MOB-572] - Firebase set up for different mob environments  
[MOB-707] - Manual User Acceptance Testing plan for Learning  