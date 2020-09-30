Totara Mobile App Changelog


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