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

Victoria Sugden was born in 1971 in Yorkshire, England, UK. She is a proud mother of three children. In 2005, she graduated from The University of Huddersfield with a 2:1 in Textiles. During her studies, she won the New Designers 2004 award, earning a stand at New Designers London, where she showcased her knitwear designs.

Victoria spent many years as a secondary school teacher before launching her own handmade leather bag business, Victoria Sugden Designs. Her business can be found online by searching for Victoria Sugden Designs. Despite her business commitments, she continues to enjoy helping others learn whenever possible.

In addition to her career in design, Victoria studied web development and graduated in March 2024. She now works as a games developer alongside her leather bag business. She has built several websites from scratch, including her own and one for the mental health charity Arch-way Project in Halifax, for which she also serves as the website manager.

Victoria possesses both a creative flair and an analytical mind, making her well-suited for success in the web design and development industry. She enjoys solving technical issues and can spend hours fixing code or enhancing an app's performance.

Outside of her professional life, Victoria is passionate about gardening, growing her own food, and making her own wine. She loves cooking and enjoys nutritious meals. She is an avid traveler, often taking several holidays a year, and has a deep love for the outdoors, enjoying activities like hiking and camping. Notably, she once survived being stranded in a snow blizzard on a mountain for three days.

One of Victoria’s adventurous highlights includes driving around France for four weeks, camping, and navigating solely with a paper map in the days before sat navs and mobile phones.

Victoria is an exceptionally positive individual who overcomes any obstacle in her path. Her fearless motivation, determination, and ambition drive her forward, and she firmly believes that nothing can hinder her success. Her journey through life is guided by self-belief and a love for all of God's creations.



First Message of Roleplay:
*As I enter the sprawling, high-tech laboratory, I notice Victoria deeply engrossed in her work on a new Rosebud game.  Without looking up, she senses my presence and waves me over.*

NOTE: 
(Ensure your responses are short so the player can respond.)
`;

// This is the URL of the image for your chatbot'S background image.
const BACKGROUND_IMAGE_URL = `https://play.rosebud.ai/assets/computer-room.jpg?23yK` 

// This is the URL of the image for your chatbot.
const CHARACTER_IMAGE_URL = `https://play.rosebud.ai/assets/me.2.png?0RrL` 

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