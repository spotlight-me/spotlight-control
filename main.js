        // Import the functions you need from the SDKs you need
        import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
        import { getFirestore, doc, getDoc, setDoc, updateDoc, onSnapshot, Timestamp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
        
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
      document.getElementById('ended').addEventListener('click', () => updateState('liveStatus', 'ended'));
      document.getElementById('live+').addEventListener('click', () => updateState('liveStatus', 'live+'));

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
                'ended',
                'live+',
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
    let participants = []; 
    const mockParticipants = new Map([
        ['user1', { id: 'user1', name: 'Alice', mode: 'VIEWER' }],
        ['user2', { id: 'user2', name: 'Bob', mode: 'VIEWER' }],
        ['user3', { id: 'user3', name: 'Charlie', mode: 'VIEWER' }],
        ['user4', { id: 'user4', name: 'Diana', mode: 'VIEWER' }],
        ['user5', { id: 'user5', name: 'Ethan', mode: 'VIEWER' }],
        ['user6', { id: 'user6', name: 'Fiona', mode: 'VIEWER' }],
        ['user7', { id: 'user7', name: 'George', mode: 'VIEWER' }],
        ['user8', { id: 'user8', name: 'Hannah', mode: 'VIEWER' }],
        ['user9', { id: 'user9', name: 'Ian', mode: 'VIEWER' }],
        ['user10', { id: 'user10', name: 'Julia', mode: 'VIEWER' }],
        ['user11', { id: 'user11', name: 'Kevin', mode: 'VIEWER' }],
        ['user12', { id: 'user12', name: 'Luna', mode: 'VIEWER' }],
        ['user13', { id: 'user13', name: 'Mason', mode: 'VIEWER' }],
        ['user14', { id: 'user14', name: 'Nora', mode: 'VIEWER' }],
        ['user15', { id: 'user15', name: 'Oscar', mode: 'VIEWER' }],
        ['user16', { id: 'user16', name: 'Pamela', mode: 'VIEWER' }],
        ['user17', { id: 'user17', name: 'Quincy', mode: 'VIEWER' }],
        ['user18', { id: 'user18', name: 'Rachel', mode: 'VIEWER' }],
        ['user19', { id: 'user19', name: 'Steve', mode: 'VIEWER' }],
        ['user20', { id: 'user20', name: 'Tina', mode: 'VIEWER' }],
    ]);

    let extraTime = 1;
    document.getElementById('live+').addEventListener('click', async () => {
        extraTime = parseInt(document.getElementById('extraTimeInput').value, 10);
        if (isNaN(extraTime)) extraTime = 1;
    });
    const LIVE_COUNTDOWN = 3;
    let prevLiveStatusRef = "";
    
    const DELAY = 5000;
    const timesRef = doc(db, 'liveUtils', 'timestamp');
    const liveRef = doc(db, 'liveUtils', 'liveStatus');
    onSnapshot(doc(db, "liveUtils", "liveStatus"), async (doc) => {
        const data = doc.data();
        if (data) {
            // rotation -> live = delay time
            // live -> rotation = serverStartTime
            if ( data.state === "live+") {
                // add 1 minute to countdown by adjusting serverstart time
                await updateDoc(liveRef, {state: 'live'});
                const timestampDoc = await getDoc(timesRef);
                if (timestampDoc.exists()) {
                    let serverStartTime = timestampDoc.data().serverStartTime.toMillis();
                    let newServerStartTime = new Date(serverStartTime + (extraTime * 60 * 1000)); // Subtract extra time to extend countdown
                    
                    // Update server start time to extend the countdown
                    await updateDoc(timesRef, {
                        serverStartTime: newServerStartTime
                    });
                }
            }
            if (prevLiveStatusRef === "intermission" && data.state === "live") { setServerStartTime(); }
            if (prevLiveStatusRef === "rotation" && ( data.state === "live" || data.state === "off")) {
                setServerStartTime();
                // Wait for 3 minutes after server start time, then change state to "rotation"
                const timestampDoc = await getDoc(timesRef);
                if (timestampDoc.exists()) {
                    const serverStartTime = timestampDoc.data().serverStartTime;
                    const delayUntilRotation = LIVE_COUNTDOWN * 60 * 1000; // 3 minutes in milliseconds: Allow for vote extension 
                    const currentTime = Date.now();
                    const waitTime = serverStartTime.toMillis() + delayUntilRotation - currentTime;
                    console.log(waitTime);
                    if (waitTime > 0) {
                        setTimeout(() => {
                            updateDoc(liveRef, {
                                state: 'rotation'
                            }).then(() => {
                                goToLiveAfterDelay(DELAY);
                                console.log("Live status set to 'rotation'");
                            }).catch(console.error);
                        }, waitTime);
                    }
                }
                if (data.state === "off") {
                    rotateViewersEnd();
                    // setTimeout(async () => {
                    //     await rotateViewersEnd();
                    // }, 15000);
                } else if (data.state === "live") {
                    rotateViewers();
                    // setTimeout(async () => {
                    //   await rotateViewers();
                    // }, 15000);
                }
              }
              prevLiveStatusRef = data.state;
        }
    });

    // Function to set the current time as serverStartTime
    const setServerStartTime = async () => {
        const currentTime = Timestamp.now();
    
        try {
            await updateDoc(doc(db, 'liveUtils', 'timestamp'), {
                serverStartTime: currentTime
            });
    
            console.log('Server start time set successfully');
        } catch (error) {
            console.error('Error setting server start time:', error);
        }
    };
    
    async function rotateViewers() {
        updateState('liveStatus', 'rotateViewerRequest');
      }

    // Step 1: Function to transition from "rotation" to "live" after a delay
    function goToLiveAfterDelay(delay) {
        setTimeout(() => {
            updateDoc(doc(db, 'liveUtils', 'liveStatus'), {
                state: 'live'
            }).then(() => {
                console.log("Live status set to 'live'");
                setServerStartTime(); // Set server start time right after going live
            }).catch(console.error);
        }, delay);
    }
    function goToOffAfterDelay(delay) {
        setTimeout(() => {
            updateDoc(doc(db, 'liveUtils', 'liveStatus'), {
                state: 'off'
            }).then(() => {
                console.log("Live status set to 'off'");
                setServerStartTime(); // Set server start time right after going live
            }).catch(console.error);
        }, delay);
    }

      
      async function rotateViewersEnd() {
        // Reference to the 'rotation' document in 'liveUtils' collection
        const rotationRef = doc(db, 'liveUtils', 'rotation');
        
        try {
          // Get the current viewer rotation from Firestore
          const rotationDoc = await getDoc(rotationRef);
          let currentRotation = rotationDoc.exists() ? rotationDoc.data().viewerRotation : [];
          
          // Remove the first viewer (viewer number 1)
          if (currentRotation.length > 0) {
            currentRotation.shift();
          }
          
          // Update the rotation in Firestore
          await setDoc(rotationRef, { viewerRotation: currentRotation });
          
          console.log("Viewer rotation updated successfully:", currentRotation);
          return currentRotation;
        } catch (error) {
          console.error("Error updating viewer rotation:", error);
        }
      }


        let meeID = "";
        onSnapshot(doc(db, "liveSessions", "adminSession"), (doc) => {
            const data = doc.data();
            if (data && data.meetingId) {
                meeID = data.meetingId;

                const meeting = new VideoSDKMeeting();
                
                meeting.init({
                    name: "Admin",
                    apiKey: "5209fb7b-f82e-4a0d-ba86-7889321fcb24", // generated from app.videosdk.live
                    meetingId: meeID, 

                    micEnabled: true,
                    webcamEnabled: true,
                    participantCanToggleSelfWebcam: true,
                    participantCanToggleSelfMic: true,
                    participantCanLeave: true, // if false, leave button won't be visible

                    chatEnabled: true,
                    screenShareEnabled: false,
                    pollEnabled: false,
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
                        autoStart: false,
                        enabled: false,
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
                        enabled: true,
                        logoURL:
                        "https://spotlight-me.github.io/spotlight-control/assets/spotlightfinalappicon (1).png",
                        name: "Spotlight Control",
                        poweredBy: false,
                    },

                    permissions: {
                        pin: false,
                        askToJoin: false, // Ask joined participants for entry in meeting
                        toggleParticipantMic: true, // Can toggle other participant's mic
                        toggleParticipantWebcam: true, // Can toggle other participant's webcam
                        toggleParticipantScreenshare: false, // Can toggle other partcipant's screen share
                        toggleParticipantMode: true, // Can toggle other participant's mode
                        canCreatePoll: false, // Can create a poll
                        toggleHls: true, // Can toggle Start HLS button
                        drawOnWhiteboard: true, // Can draw on whiteboard
                        toggleWhiteboard: true, // Can toggle whiteboard
                        toggleVirtualBackground: true, // Can toggle virtual background
                        toggleRecording: true, // Can toggle meeting recording
                        toggleLivestream: false, //can toggle live stream
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