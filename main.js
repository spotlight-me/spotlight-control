        // Import the functions you need from the SDKs you need
        import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
        import { getFirestore, doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
        
        // Your web app's Firebase configuration
        const firebaseConfig = {
          apiKey: "AIzaSyA8N1cdRvNMMl6AWFveihoOSCen7UoA3bY",
          authDomain: "spotlight-b5666.firebaseapp.com",
          projectId: "spotlight-b5666",
          storageBucket: "spotlight-b5666.appspot.com",
          messagingSenderId: "723412961195",
          appId: "1:723412961195:web:011ef6ccebd86f7db3f4ee",
          measurementId: "G-1JP2DMR5TD"
        };
        
        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        
        function updateState(docId, state) {
            setDoc(doc(db, "liveUtils", docId), { state: state })
                .then(() => {
                    console.log('State updated to', state);
                    //alert('State updated to ' + state);
                })
                .catch(error => {
                    console.error('Error updating state:', error);
                    alert('Error updating state. Check console for details.');
                });
        }
      // Attach event listeners
      document.getElementById('live').addEventListener('click', () => updateState('liveStatus', 'live'));
      document.getElementById('intermission').addEventListener('click', () => updateState('liveStatus', 'intermission'));
      document.getElementById('rotation').addEventListener('click', () => updateState('liveStatus', 'rotation'));
      document.getElementById('off').addEventListener('click', () => updateState('liveStatus', 'off'));

      // Attach event listeners
      document.getElementById('init').addEventListener('click', () => updateState('rotationStatus', 'init'));
      document.getElementById('choosing').addEventListener('click', () => updateState('rotationStatus', 'choosing'));
      document.getElementById('chosen').addEventListener('click', () => updateState('rotationStatus', 'chosen'));
      document.getElementById('toggleSidePanel').addEventListener('click', function() {
        var sidePanel = document.getElementById('sidePanel');
        if (sidePanel.style.width === '30%') {
            sidePanel.style.width = '0';
        } else {
            sidePanel.style.width = '30%';
        }
    });
    document.getElementById('toggleLive').addEventListener('click', function() {
        setDoc(doc(db, "liveSessions", "adminSession"), { meetingId: "7mkk-ixnx-kf0s" })
                .then(() => {
                    console.log("Meeting ID set successfully");
                })
                .catch(error => {
                    console.error("Error setting meeting ID: ", error);
        });
    });
      const viewerRotationContainer = document.getElementById('viewerRotationList');

    // Function to update UI with viewerRotation array
    function updateViewerRotationUI(viewerRotation) {
        // Clear existing viewerRotation list
        viewerRotationContainer.innerHTML = '';

        // Add each viewerRotation item to the list
        viewerRotation.slice(0, 3).forEach((viewer, index) => {
            let li = document.createElement('li');
            li.textContent = `${index + 1}. ${viewer}`; // Numbering viewers 1-3
            viewerRotationContainer.appendChild(li);
        });
    }

    // Listen for real-time updates
    onSnapshot(doc(db, "liveUtils", "rotation"), (doc) => {
        const data = doc.data();
        if (data && data.viewerRotation) {
            updateViewerRotationUI(data.viewerRotation);
        } else {
            viewerRotationContainer.innerHTML = '<li>No viewers currently in rotation.</li>';
        }
    });

    function removeActiveClass(buttonIds) {
        buttonIds.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.classList.remove('active');
        });
    }


    function highlightCurrentStateButton(currentState, buttonIds) {
        // Correctly pass the specific array of button IDs to remove the 'active' class
        removeActiveClass(buttonIds);
        
        // Get button ID for current state
        const currentButtonId = currentState;
        
        // Add 'active' class to current state button
        const currentButton = document.getElementById(currentButtonId);
        if (currentButton) currentButton.classList.add('active');
    }

    // Adjusted Firestore listeners to pass the correct button IDs array
    onSnapshot(doc(db, "liveUtils", "liveStatus"), (doc) => {
        const data = doc.data();
        if (data && data.state) {
            const liveButtonIds = [
                'live',
                'intermission',
                'rotation',
                'off',
        ]   ;
            highlightCurrentStateButton(data.state, liveButtonIds);
        }
    });

    onSnapshot(doc(db, "liveSessions", "adminSession"), (docSnapshot) => {
        const button = document.getElementById('toggleLive');
        if (docSnapshot.exists()) {
            console.log("Exists");
            button.hidden = true;
        } else {
            console.log("Does not exist");
            button.hidden = false;
        }
    });

    document.addEventListener('DOMContentLoaded', () => {
        const actionButton = document.querySelector('[href="/"]'); // Example selector, adjust based on actual button
        if (actionButton) {
            actionButton.addEventListener('click', (event) => {
                event.preventDefault(); // Stop the link from navigating
                console.log("Intercepted");
                deleteAdminSession();
            });
        }
    });

    function deleteAdminSession() {
        const db = getFirestore();
        deleteDoc(doc(db, "liveSessions", "adminSession"))
            .then(() => console.log("Document successfully deleted!"))
            .catch((error) => console.error("Error removing document: ", error));
    }

    onSnapshot(doc(db, "liveUtils", "rotationStatus"), (doc) => {
        const data = doc.data();
        if (data && data.state) {
            const rotationButtonIds = [
                'init',
                'choosing',
                'chosen'
            ];
            highlightCurrentStateButton(data.state, rotationButtonIds);
        }
    });
        let meeID = "";
        onSnapshot(doc(db, "liveSessions", "adminSession"), (doc) => {
            const data = doc.data();
            if (data && data.meetingId) {
                meeID = data.meetingId;

                const meeting = new VideoSDKMeeting();

        meeting.init({
            name: "Admin",
            apiKey: "5209fb7b-f82e-4a0d-ba86-7889321fcb24", // generated from app.videosdk.live
            meetingId: meeID, // enter your meeting id

            micEnabled: false,
            webcamEnabled: false,
            participantCanToggleSelfWebcam: false,
            participantCanToggleSelfMic: false,
            participantCanLeave: true, // if false, leave button won't be visible

            chatEnabled: true,
            screenShareEnabled: true,
            pollEnabled: true,
            whiteboardEnabled: false,
            raiseHandEnabled: false,
            mode: "CONFERENCE",  // || CONFERENCE

            // recording: {
            //     autoStart: true, // auto start recording on participant joined
            //     enabled: true,
            //     webhookUrl: "https://www.videosdk.live/callback",
            //     awsDirPath: `/meeting-recordings/${meetingId}/`, // automatically save recording in this s3 path
            // },

            livestream: {
                autoStart: true,
                enabled: true,
            },

            hls: {
                enabled: true,
                autoStart: false,
            },

            layout: {
                type: "SPOTLIGHT", // "SPOTLIGHT" | "SIDEBAR" | "GRID"
                priority: "SPEAKER", // "SPEAKER" | "PIN",
                // gridSize: 3,
            },

            branding: {
                enabled: false,
                logoURL:
                "assets\spotlightfinalappicon (1).png",
                name: "Spotlight Control",
                poweredBy: false,
            },

            permissions: {
                pin: false,
                askToJoin: false, // Ask joined participants for entry in meeting
                toggleParticipantMic: true, // Can toggle other participant's mic
                toggleParticipantWebcam: true, // Can toggle other participant's webcam
                toggleParticipantScreenshare: true, // Can toggle other partcipant's screen share
                toggleParticipantMode: true, // Can toggle other participant's mode
                canCreatePoll: true, // Can create a poll
                toggleHls: true, // Can toggle Start HLS button
                drawOnWhiteboard: true, // Can draw on whiteboard
                toggleWhiteboard: true, // Can toggle whiteboard
                toggleVirtualBackground: true, // Can toggle virtual background
                toggleRecording: true, // Can toggle meeting recording
                toggleLivestream: true, //can toggle live stream
                removeParticipant: true, // Can remove participant
                endMeeting: true, // Can end meeting
                changeLayout: true, //can change layout
            },

            joinScreen: {
                visible: true, // Show the join screen ?
                title: "Spotlight Live", // Meeting title
                meetingUrl: meeID, // Meeting joining url
            },

            leftScreen: {
                // visible when redirect on leave not provieded
                actionButton: {
                // optional action button
                label: "Shutdown Session", // action button label
                href: "https://spotlight-me.github.io/spotlight-control/deleteAdminSession.html", // action button href
                },
            },

            notificationSoundEnabled: true,

            debug: true, // pop up error during invalid config or netwrok error

            maxResolution: "sd", // "hd" or "sd"
        });
            }
        });

        