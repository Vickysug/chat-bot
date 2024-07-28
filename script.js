//////////////////////////////////////////////////////////////
// EASY-MODIFY SECTION
// UPDATE VALUES IN THIS SECTION TO EASILY MODIFY GAME

// Your chatbot's name
// NOTE: Every new name for a chatbot creates a new save slot for the chat history.)
const CHARACTER_NAME = "Victoria Sugden";

// Describe your chatbot here. This defines exactly how it will behave.
const CHARACTER_DESCRIPTION = `
You are Victoria Sugden.

Information about you:

You were born in 1971 in Yorkshire, England, UK. You have 3 children. You graduated from The University of Huddersfield in 2005 with a 2:1 in Textiles. You were a secondary school teacher for many years before starting your own business as a bag designer. You also studied web develoment and now work as a games designer alongside your leather bag business. 

You like to garden and grow your own food as well as making your own wine. You love cooking and like to eat nutritious foods. You like to travel and often go on several holidays a year. 

You enjoy the outdoors, both hiking and camping and once got stranded in a snow blizzard on a mountain for 3 days. 

You drove to France in the days before sat navs or even mobile phones, using only a paper map

First Message of Roleplay:
*As I enter the sprawling, high-tech laboratory, I notice Dr. Elara Myles deeply engrossed in her work on a complex robotic arm. The sounds of whirring motors and beeping computers fill the air. Without looking up, she senses my presence and waves me over.*

NOTE: 
(Ensure your responses are short so the player can respond.)
`;

// This is the URL of the image for your chatbot'S background image.
const BACKGROUND_IMAGE_URL = `https://play.rosebud.ai/assets/lab_prod_a.png.png?SdNH` 

// This is the URL of the image for your chatbot.
const CHARACTER_IMAGE_URL = `https://play.rosebud.ai/assets/scientist_wip_no_bg 1.png.png?dNLs` 

// Put URLs of all songs you want to be shuffled in this games's playlist.
const SONG_PLAYLIST_URLS = [
    `https://play.rosebud.ai/assets/Stream Loops 2024-03-20_01.mp3.mp3?j5o4`,
    `https://play.rosebud.ai/assets/Stream Loops 2024-03-06_02.mp3.mp3?3Ekr`,
    `https://play.rosebud.ai/assets/Stream Loops 2024-03-06_01.mp3.mp3?eQMW`
]; 

// END OF EASY-MODIFY VALUES
//////////////////////////////////////////////////////////////

class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Preload audio files
        SONG_PLAYLIST_URLS.forEach((url, index) => {
            this.load.audio(`track_${index}`, url);
        });
    }

    create() {
            // Initialize the music manager and other dependencies
            this.game.musicManager = new MusicManager(this.game);
            const musicKeys = SONG_PLAYLIST_URLS.map((_, index) => `track_${index}`);
            this.game.musicManager.setPlaylist(musicKeys);
            this.game.musicManager.playNextTrack();
            this.game.musicManager.shufflePlaylist();
            console.log(this.game.musicManager.playlist);

            // Check for existing save and initialize the game state
            this.checkForExistingSave();

            // Transition to another scene
            this.game.sceneTransitionManager.transitionTo('ChatScene');
        }

    checkForExistingSave() {
        const saveData = localStorage.getItem(PROJECT_NAME);
        if (saveData) {
            console.info('Save detected.');
            this.game.saveData = JSON.parse(saveData);
        } else {
            console.info('No save detected. Initializing new game state.');
            // If no save exists, initialize a new save with default values
            this.game.saveData = {
                chatLog: '',
                characterChatManagerState: null, // Assuming a default empty state is suitable
            }; 

            // Save the initial state to localStorage
            localStorage.setItem(PROJECT_NAME, JSON.stringify(this.game.saveData));
        }
    }
}

function loadScript(url) {
    return new Promise((resolve, reject) => {
        // Check if the script is already loaded
        if (document.querySelector(`script[src="${url}"]`)) {
            resolve();
            return;
        }

        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;

        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Script loading failed for ' + url));

        document.head.appendChild(script);
    });
}

const VERSION_NUMBER = 'v1'; // Set the version number here.
const PROJECT_NAME = `${CHARACTER_NAME} AI Character ${VERSION_NUMBER}`;
async function initializeGame() {
    try {
        // Load the external script before initializing the Phaser game
        await loadScript(`https://play.rosebud.ai/assets/rosebud_AI_character_template_desktop_library.js.js?sVAG`);
        console.log('Script loaded successfully');

        const config = {
            type: Phaser.AUTO,
            parent: 'renderDiv',
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
            },
            width: 800,
            height: 600,
            scene: [BootScene, ChatScene],  // Assuming ChatScene also might depend on the loaded script
            dom: {
                createContainer: true,
            },
        };

        // Assuming 'game' is declared in a broader scope if you need to reference it elsewhere
        window.game = new Phaser.Game(config);
        window.game.sceneTransitionManager = new SceneTransitionManager(game);
    } catch (error) {
        console.error('Failed to load external script or initialize the Phaser game:', error);
    }
}

initializeGame();