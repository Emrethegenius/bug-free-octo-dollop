// ============================================
// VERSION AND CACHE RESET
// ============================================
const QUESTIONS_VERSION = 'v7';
const QUIZ_START_DATE = new Date("2025-02-19");

// Unified cache clearing function
function clearCacheAndReload() {
    // Clear all game-related localStorage items
    localStorage.clear();
    
    // Clear browser cache
    if (window.caches) {
        caches.keys().then(names => {
            names.forEach(name => {
                caches.delete(name);
            });
        });
    }
    
    // Force reload from server
    window.location.href = window.location.href + '?nocache=' + new Date().getTime();
}

// Add cache control headers
document.head.innerHTML += `
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate, max-age=0">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    <meta http-equiv="Clear-Site-Data" content="cache">
`;

// Initial cache check
(function() {
    const todayStr = new Date().toDateString();
    const storedDate = localStorage.getItem('dailyQuestionsDate');
    const storedVersion = localStorage.getItem('dailyQuestionsVersion');
    const storedLast = localStorage.getItem('lastPlayed');

    console.debug('Cache check:', { 
        storedDate, 
        storedVersion, 
        today: todayStr, 
        storedLast,
        currentTime: new Date().toLocaleTimeString() 
    });

    if ((storedDate && storedDate !== todayStr) || 
        (storedVersion && storedVersion !== QUESTIONS_VERSION)) {
        clearCacheAndReload();
    }
})();

// Regular interval check (every minute)
setInterval(() => {
    const todayStr = new Date().toDateString();
    const storedDate = localStorage.getItem('dailyQuestionsDate');
    
    if (!storedDate || storedDate !== todayStr) {
        clearCacheAndReload();
    }
}, 60000);

// Midnight reset checker
function checkMidnightReset() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeUntilMidnight = tomorrow - now;
    
    // Force immediate check at startup
    const todayStr = new Date().toDateString();
    const storedDate = localStorage.getItem('dailyQuestionsDate');
    if (!storedDate || storedDate !== todayStr) {
        clearCacheAndReload();
    }
    
    setTimeout(() => {
        clearCacheAndReload();
        checkMidnightReset();
    }, timeUntilMidnight);
}


document.addEventListener('DOMContentLoaded', checkMidnightReset);








// FIXED QUESTION POOL & DAILY SELECTOR
// --------------------------------------
// Define your fixed pool of 35 questions in the desired order.
const questionPool = [
    // Group 1: Questions 1 - 5
    // Question 1:
{
  "question": "Where did the Nord Stream pipeline explosions occur in 2022, leading to international controversy over who was responsible?",
  "answer": [54.876667, 15.41],
  "name": "Bornholm, Baltic Sea",
  "image": "images/nord_stream.jpg",
  "info": "On September 26, 2022, mysterious underwater blasts ruptured the Nord Stream pipelines near Bornholm, sparking global debate over sabotage."
},
  
    // Question 2:
{
  "question": "On July 8, 2022, a former Prime Minister was shot and killed with a homemade gun while delivering a campaign speech. Where did the assassination take place?",
  "answer": [34.694056, 135.783944],
  "name": "Nara, Japan – Assassination Site",
  "image": "images/shinzo_abe_assassination.jpg",
  "info": "On July 8, 2022, former Japanese Prime Minister Shinzo Abe was assassinated during a public campaign event in Nara, Japan, by an assailant using a homemade firearm."
},
  
    // Question 3:
    {
  "question": "In 1849, the first recorded ascent of this iconic mountain, the highest point of any European Union country, took place. Where did the climb happen?",
  "answer": [45.832778, 6.865],
  "name": "Mont Blanc, France/Italy border",
  "image": "images/mont_blanc_ascent.jpg",
  "info": "On August 8, 1849, the first successful ascent of Mont Blanc was made by Jacques Balmat and Dr. Michel-Gabriel Paccard, marking a milestone in mountaineering."
},
  
    // Question 4:
{
  "question": "In 1928, this famous motion picture was released, marking the first feature-length sound film. Where did its premiere occur?",
  "answer": [34.10211993274641, -118.34102904037215],
  "name": "Grauman's Chinese Theatre, Hollywood, USA",
  "image": "images/the_jazz_singer_premiere.jpg",
  "info": "On October 6, 1927, *The Jazz Singer* premiered at Grauman's Chinese Theatre in Hollywood, California, revolutionizing the film industry with its synchronized sound."
},
  
    // Question 5:
{
  "question": "In 1978, a Soviet geological survey team stumbled upon a family living in isolation deep in the Siberian wilderness, completely unaware of the outside world for about 40 years. Can you pinpoint where this discovery took place?",
  "answer": [51.46087, 88.42713],
  "name": "Lykov Family Discovery Site, Siberia, Russia",
  "image": "images/lykov_family_discovery.jpg",
  "info": "The Lykov family, who had been living in complete isolation since the 1930s, were discovered in 1978 by a Soviet geological team, unaware of major historical events for about 40 years."
},
  
    // Group 2: Questions 6 - 10
    // Question 6:
    {
  "question": "Where did the deadliest volcanic eruption of the 20th century bury entire towns in 1902?",
  "answer": [14.8075, -61.1675],
  "name": "Mount Pelée, Martinique",
  "image": "images/mount_pelee_eruption.jpg",
  "info": "The eruption of Mount Pelée destroyed Saint-Pierre, killing nearly all of its 30,000 residents."
},
  
    // Question 7:
{
  "question": "Where did U.S. Air Force member Aaron Bushnell self-immolate in 2024 as a protest against the Gaza Genocide?",
  "answer": [38.94268371477785, -77.0677980882309],
  "name": "Israeli Embassy, Washington, D.C., USA",
  "image": "images/aaron_bushnell_protest.jpg",
  "info": "On February 25, 2024, Aaron Bushnell set himself on fire outside the Israeli Embassy in Washington, D.C., protesting the treatment of Palestinians in Gaza."
},
  
    // Question 8:
    {
  "question": "Where did a monumental expedition in 1960 set the record for the deepest manned dive in history?",
  "answer": [11.373333, 142.591667],
  "name": "Challenger Deep, Mariana Trench, Pacific Ocean",
  "image": "images/challenger_deep.jpg",
  "info": "Jacques Piccard and Don Walsh descended to the deepest part of the ocean, reaching a depth of approximately 10,911 meters."
},
  
    // Question 9:
    {
  "question": "Where did D.B. Cooper hijack a commercial airplane in 1971, leading to a landmark case in aviation law?",
  "answer": [47.448889, -122.309444],
  "name": "Seattle-Tacoma International Airport, USA",
  "image": "images/db_cooper_hijacking.jpg",
  "info": "D.B. Cooper famously hijacked a plane here, parachuted out with a ransom, and vanished without a trace."
},
  
    // Question 10:
    {
  "question": "Where is the smallest population of any self-governing territory located?",
  "answer": [-25.066667, -130.1],
  "name": "Pitcairn Island",
  "image": "images/pitcairn_population.jpg",
  "info": "Pitcairn is home to fewer than 100 residents, making it one of the least populated territories in the world."
},
  
    // Group 3: Questions 11 - 15
    // Question 11:
    {
  "question": "Which location became the center of a highly publicized hunger strike in 1981 that resulted in the deaths of ten men seeking political recognition?",
  "answer": [54.48707269241484, -6.1112061857047575],
  "name": "HM Prison Maze, Northern Ireland",
  "image": "images/irish_hunger_strike.jpg",
  "info": "In 1981, Irish republican prisoners at HM Prison Maze went on hunger strike for political status. Ten, including Bobby Sands, died, drawing global attention."
},
  
    // Question 12:
    {
  "question": "Where did Usain Bolt set the 100m world record in 2009, a feat yet to be surpassed?",
  "answer": [52.5146, 13.2394],
  "name": "Olympiastadion, Berlin, Germany",
  "image": "images/usain_bolt_100m.jpg",
  "info": "Usain Bolt set the 100m world record of 9.58 seconds at the 2009 World Championships in Berlin, the fastest time ever recorded."
},
  
    // Question 13:
    {
  "question": "Which location became infamous in 1947 after reports of a mysterious crash sparked decades of speculation about extraterrestrial life?",
  "answer": [33.950278, -105.314167],
  "name": "Crash Site Near Corona, New Mexico, USA",
  "image": "images/ufo_crash_site.jpg",
  "info": "A 1947 crash in the New Mexico desert became one of the most famous UFO-related incidents, inspiring conspiracy theories and ongoing debate about extraterrestrial encounters."
},
  
    // Question 14:
    {
  "question": "Which Greek city was home to a giant statue that once stood at its harbor entrance, considered one of the Seven Wonders of the Ancient World?",
  "answer": [36.4512, 28.2244],
  "name": "Rhodes, Greece",
  "image": "images/ancient_statue.jpg",
  "info": "An enormous statue, built to celebrate the victory over Cyprus in 305 BC, stood at the harbor entrance of Rhodes. It was toppled by an earthquake in 226 BC, and its remnants were eventually sold off as scrap metal."
},
  
    // Question 15:
    {
  "question": "Where was the wreck of the Titanic discovered in 1985, over 70 years after the ship sank?",
  "answer": [41.7269, -49.9481],
  "name": "North Atlantic Ocean, off the coast of Newfoundland, Canada",
  "image": "images/titanic_wreck.jpg",
  "info": "In 1985, the wreck of the RMS Titanic was discovered by oceanographer Robert Ballard, lying about 12,500 feet beneath the surface of the North Atlantic."
},
  
    // Group 4: Questions 16 - 20
    // Question 16:
    {
  "question": "Once described as the most densely populated place on Earth, this area was a lawless enclave until its demolition in the 1990s. Can you identify where it stood?",
  "answer": [22.332222, 114.190278],
  "name": "Kowloon Walled City",
  "image": "images/kowloon_walled_city.jpg",
  "info": "The Kowloon Walled City was a densely packed, ungoverned area, infamous for its chaotic structure, criminal activity, and overcrowding before it was demolished in 1993."
},
  
    // Question 17:
    {
  "question": "Where did a break-in occur in 1972, leading to the political scandal that ultimately forced a U.S. president to resign?",
  "answer": [38.89896487488606, -77.05553242194483],
  "name": "Watergate Complex, Washington, D.C., USA",
  "image": "images/watergate_scandal.jpg",
  "info": "On June 17, 1972, five men were caught breaking into the Democratic National Committee offices at the Watergate Complex, setting off the Watergate scandal and resulting in the resignation of President Richard Nixon."
},
  
    // Question 18:
    {
  "question": "Which site, later immortalized by Picasso, was devastated in 1937 during one of history’s first aerial bombardments targeting civilians?",
  "answer": [43.313889, -2.678333],
  "name": "Guernica Bombing Site, Spain",
  "image": "images/guernica_bombing.jpg",
  "info": "On April 26, 1937, Nazi Germany’s Condor Legion bombed this town during the Spanish Civil War, inspiring Picasso’s famous anti-war painting *Guernica*."
},
  
    // Question 19:
    {
  "question": "Where did the Concorde supersonic jet crash in 2000, ending the era of commercial supersonic travel?",
  "answer": [48.985556, 2.472222],
  "name": "Gonesse, France",
  "image": "images/concorde_crash.jpg",
  "info": "On July 25, 2000, Air France Flight 4590 crashed shortly after takeoff from Charles de Gaulle Airport due to tire debris, leading to the retirement of the Concorde fleet."
},
  
    // Question 20:
    {
  "question": "Where did a high-altitude U.S. spy plane get shot down in 1960, escalating Cold War tensions?",
  "answer": [56.726389, 60.986111],
  "name": "U-2 Crash Site, near Degtyarsk, Soviet Union (now Russia)",
  "image": "images/u2_incident.jpg",
  "info": "On May 1, 1960, a Soviet missile shot down a U.S. U-2 spy plane piloted by Francis Gary Powers near Degtyarsk, exposing American reconnaissance operations over the USSR."
},
  
    // Group 5: Questions 21 - 25
// Question 21:
{
  "question": "In 2004, a massive undersea earthquake triggered one of the deadliest tsunamis in recorded history, devastating coastal areas. Can you locate the epicenter?",
  "answer": [3.316, 95.854],
  "name": "2004 Indian Ocean Earthquake Epicenter, Near Ache",
  "image": "images/indian_ocean_tsunami.jpg",
  "info": "A magnitude 9.1 earthquake struck off the coast of Sumatra, triggering a tsunami that killed over 230,000 people across multiple countries."
},
  
  // Question 22:
  {
  "question": "In 1901, the first transatlantic wireless signal was received at this remote coastal point, changing global communication forever. Can you locate it?",
  "answer": [50.02900408579307, -5.264024985385264],
  "name": "Poldhu Wireless Station, Wales",
  "image": "images/marconi_signal.jpg",
  "info": "Guglielmo Marconi successfully received the first transatlantic radio signal at Poldhu, proving wireless communication over vast distances was possible."
},
  
  // Question 23:
  {
  "question": "A luxury cruise liner, which sank in 2012, was the largest ship ever raised from the ocean floor. Can you find its final resting place before salvage?",
  "answer": [42.365278, 10.921667],
  "name": "Isola del Giglio, Italy",
  "image": "images/costa_concordia.jpg",
  "info": "The *Costa Concordia* ran aground near an Italian island in 2012, leading to 32 deaths. It was later refloated and dismantled in the largest-ever salvage operation."
},
  
  // Question 24:
  {
  "question": "This ancient underground city, capable of housing thousands, was rediscovered by accident when a resident broke through a wall. Can you locate it?",
  "answer": [38.3735, 34.7351],
  "name": "Derinkuyu Underground City, Turkey",
  "image": "images/derinkuyu_underground.jpg",
  "info": "Derinkuyu, carved beneath the earth, was a vast multi-level underground city used as a refuge from invasions in ancient times."
},
  
  // Question 25:
  {
  "question": "Discovered by accident in 1940, this cave, known for its ancient artwork, was featured in a Werner Herzog documentary. Can you identify its location?",
  "answer": [45.053611, 1.17],
  "name": "Montignac, France",
  "image": "images/lascaux_cave.jpg",
  "info": "The Cave of Lascaux, located in France, is home to some of the world’s most famous Paleolithic cave paintings, which were featured in Herzog’s 2010 documentary *Cave of Forgotten Dreams*."
},
  
  // Group 6: Questions 26 - 30
  // Question 26:
  {
  "question": "This immense temple complex, originally dedicated to the Hindu god Vishnu, later became a center for Buddhist worship. Can you locate it?",
  "answer": [13.4125, 103.866667],  
  "name": "Angkor Wat",  
  "image": "images/angkor_wat.jpg",  
  "info": "Angkor Wat, built in the early 12th century by King Suryavarman II, is one of the largest religious monuments in the world and a symbol of Cambodia’s cultural heritage."
},
  
  // Question 27:
  {
  "question": "During a U.S.-backed coup in 1973, the country's democratically elected leader made his final stand here, refusing to surrender. Can you find this site?",
  "answer": [-33.44238082484133, -70.65394282149734],  
  "name": "La Moneda Palace",  
  "image": "images/la_moneda_palace.jpg",  
  "info": "On September 11, 1973, Salvador Allende, Chile’s democratically elected president, gave his final speech from La Moneda Palace as it was bombed during a coup linked to Operation Condor. He died defending his government against the military takeover."  
},
  
  // Question 28:
  {
  "question": "Intended as a symbol of national pride, this towering structure remains largely empty decades after construction began. Can you locate it?",
  "answer": [39.036439578846604, 125.73079661606694],
  "name": "Ryugyong Hotel",
  "image": "images/ryugyong_hotel.jpg",
  "info": "The Ryugyong Hotel in Pyongyang, started in 1987, remains unfinished despite efforts to complete the 105-story skyscraper."
},
  
  // Question 29:
  {
  "question": "Towering above the landscape, this colossal monument is the tallest statue on Earth. Can you locate it?",
  "answer": [21.8380, 73.7191],  
  "name": "Statue of Unity",  
  "image": "images/statue_of_unity.jpg",  
  "info": "Standing at 182 meters, the Statue of Unity in India honors Sardar Vallabhbhai Patel, a key figure in the country's independence and unification."  
}, 
  
  // Question 30:
  {
  "question": "At this venue, the film industry’s most prestigious awards have been handed out for decades. Can you pinpoint this iconic location?",
  "answer": [34.1027573233757, -118.34043183931465],  
  "name": "Dolby Theatre",  
  "image": "images/dolby_theatre.jpg",  
  "info": "Since 2002, the Dolby Theatre in Los Angeles has hosted the annual Academy Awards, where the biggest names in cinema gather to celebrate achievements in film."  
},
  
    // Group 7: Questions 31 - 35
    // Question 31:
    {
  "question": "At this location in 1794, the man who led the most intense period of political purges was arrested and executed, marking the fall of his influence. Can you pinpoint where it happened?",  
  "answer": [48.865633, 2.321236],  
  "name": "Place de la Révolution, Paris, France",  
  "image": "images/robespierre_execution.jpg",  
  "info": "On July 28, 1794, Maximilien Robespierre, known for his role in orchestrating mass executions, was arrested and executed by guillotine at Place de la Révolution in Paris, ending his reign of power."  
},
      
      // Question 32:
      {
  "question": "After drifting for an astonishing 438 days, the longest-known castaway finally made landfall at this remote location in 2014. Can you pinpoint where his journey ended?",  
  "answer": [4.620641464060111, 168.77004985661048],  
  "name": "Tile Islet, Ebon Atoll, Marshall Islands",  
  "image": "images/castaway_landfall.jpg",  
  "info": "José Salvador Alvarenga, a fisherman from El Salvador, was lost at sea for 438 days before making landfall on Tile Islet in the Marshall Islands in 2014. He survived on fish, birds, and rainwater after drifting over 10,000 km across the Pacific Ocean."  
},
      
      // Question 33:
      {
  "question": "At this remote settlement in 1978, a leader’s final orders led to a mass suicide, claiming over 900 lives in one of history’s deadliest cult tragedies. Can you locate this site?",  
  "answer": [7.689444, -59.95],  
  "name": "Jonestown, Guyana",  
  "image": "images/jonestown_massacre.jpg",  
  "info": "On November 18, 1978, over 900 members of the Peoples Temple, led by Jim Jones, died in a mass murder-suicide at Jonestown, Guyana. Many were forced to drink poisoned Flavor Aid in a tragedy that shocked the world."  
},
      
      // Question 34:
      {
  "question": "At this lakeside location in 1871, a journalist finally found a long-lost explorer and greeted him with the now-famous words: 'Dr. Livingstone, I presume?' Can you pinpoint this historic meeting place?",  
  "answer": [-4.920021122456501, 29.674622235711507],  
  "name": "Livingstone Memorial, Ujiji, Tanzania",  
  "image": "images/livingstone_memorial.jpg",  
  "info": "On November 10, 1871, Henry Morton Stanley met Dr. David Livingstone near the shores of Lake Tanganyika in Ujiji. The site, now marked by the Livingstone Memorial, commemorates one of history’s most famous encounters."  
},
      
      // Question 35:
      {
  "question": "At this precise location, an ancient dream of cutting through land to connect two seas was finally realized in 1893. Can you pinpoint where this engineering marvel is located?",
  "answer": [37.934722, 22.983889],
  "name": "Corinth Canal, Greece",
  "image": "images/corinth_canal.jpg",
  "info": "The Corinth Canal, completed in 1893, cuts through the narrow Isthmus of Corinth, linking the Aegean and Ionian Seas. Though envisioned by ancient rulers, it wasn’t finished until modern engineering made it possible."
}
  ];
  
  const imageCreditsPool = [
    // Group 1 (Questions 1-5)
    ["1: Courtesy of National Geographic Historical Archive",        // Q1
     "2: From the Smithsonian Institution Digital Collection",      // Q2
     "3: Provided by World History Photo Database",                // Q3
     "4: From UNESCO World Heritage Digital Archive",              // Q4
     "5: Courtesy of Library of Congress Digital Collection"],      // Q5

    // Group 2 (Questions 6-10)
    ["1: From British Museum Digital Archives",                     // Q6
     "2: Courtesy of European Historical Photo Database",          // Q7
     "3: From Russian State Historical Archive",                   // Q8
     "4: Provided by Asian Heritage Digital Collection",           // Q9
     "5: From African Cultural Heritage Database"],                // Q10

    // Group 3 (Questions 11-15)
    ["1: Courtesy of Australian National Archives",                 // Q11
     "2: From South American Historical Society",                  // Q12
     "3: Provided by Middle Eastern Heritage Foundation",          // Q13
     "4: From Nordic Historical Photo Collection",                 // Q14
     "5: Courtesy of Mediterranean Cultural Archive"],             // Q15

    // Group 4 (Questions 16-20)
    ["1: From Pacific Historical Photo Database",                   // Q16
     "2: Courtesy of Canadian National Archives",                  // Q17
     "3: From Indian Historical Society Collection",               // Q18
     "4: Provided by Southeast Asian Heritage Archive",            // Q19
     "5: From Central American Cultural Database"],                // Q20

    // Group 5 (Questions 21-25)
    ["1: From French National Photo Archives",                      // Q21
     "2: Courtesy of German Historical Society",                   // Q22
     "3: From Italian Cultural Heritage Collection",               // Q23
     "4: Provided by Spanish Royal Archives",                      // Q24
     "5: From Portuguese Maritime Museum"],                        // Q25

    // Group 6 (Questions 26-30)
    ["1: From Mexican National Archives",                          // Q26
     "2: Courtesy of Brazilian Historical Institute",              // Q27
     "3: From Argentine Cultural Heritage Foundation",             // Q28
     "4: Provided by Chilean National Museum",                     // Q29
     "5: From Peruvian Archaeological Archives"],                  // Q30

    // Group 7 (Questions 31-35)
    ["1: From Japanese Imperial Archives",                         // Q31
     "2: Courtesy of Korean Cultural Heritage Administration",     // Q32
     "3: From Chinese Historical Society",                         // Q33
     "4: Provided by Vietnamese National Museum",                  // Q34
     "5: From Thai Royal Collection"]                             // Q35
];

function getDailyImageCredit() {
    const today = new Date();
    const diffDays = Math.floor((today - QUIZ_START_DATE) / (1000 * 60 * 60 * 24));
    const segments = imageCreditsPool.length;
    const segmentIndex = diffDays % segments;
    return imageCreditsPool[segmentIndex];
}





function getDailyQuizNumber() {
    const today = new Date();
    const todayMidnight = new Date(today.setHours(0, 0, 0, 0));
    const startMidnight = new Date(QUIZ_START_DATE.setHours(0, 0, 0, 0));
    const diffTime = todayMidnight - startMidnight;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
}






function getDailyQuestions() {
    const today = new Date();
    const todayStr = today.toDateString();
    const storedDate = localStorage.getItem('dailyQuestionsDate');

    // Calculate number of days elapsed from QUIZ_START_DATE.
    const diffDays = Math.floor((today - QUIZ_START_DATE) / (1000 * 60 * 60 * 24));
    const segments = Math.floor(questionPool.length / 5);
    const segmentIndex = diffDays % segments;
    const dailySubset = questionPool.slice(segmentIndex * 5, segmentIndex * 5 + 5);

    if (storedDate !== todayStr) {
        localStorage.setItem('dailyQuestionsDate', todayStr);
        localStorage.setItem('dailyQuestions', JSON.stringify(dailySubset));
        localStorage.setItem('dailyQuestionsVersion', QUESTIONS_VERSION);
        return dailySubset;
    } else {
        const storedQuestions = localStorage.getItem('dailyQuestions');
        return storedQuestions ? JSON.parse(storedQuestions) : dailySubset;
    }
}




    
// --------------------------------------
// EXISTING GLOBAL VARIABLES & GAME FUNCTIONS (UNCHANGED)
let marker = null;
let correctMarker = null;
let line = null;
let currentQuestion = 0;
let allGuesses = [];
let allMarkers = [];
let allLines = [];
let map, correctLocation, canGuess = true, totalScore = 0, roundsPlayed = 0;
let currentGuess = null;
let mapClickEnabled = true;
let quizStartTime = null;
let questionStartTimes = [];
let totalGameTime = 0;
const LAST_PLAYED_KEY = 'lastPlayed';
const DAILY_SCORES_KEY = 'dailyScores';

// NEW QUESTIONS INITIALIZATION: Use the daily selector to get 5 questions for today.
let questions = getDailyQuestions();

function showModal() {
    const modal = document.getElementById('info-modal');
    modal.style.display = 'block';
    
    // Add slight delay to ensure proper rendering
    setTimeout(() => {
        adjustModalContent();
    }, 100);
}

// Add these event listeners
window.addEventListener('resize', adjustModalContent);
window.addEventListener('load', adjustModalContent);

function hideModal() {
    const modal = document.getElementById('info-modal');
    modal.style.display = 'none';
}

function adjustModalContent() {
    const modalMap = document.getElementById('modal-map');
    const modalInfo = document.querySelector('.modal-info');

    // Default sizes
    modalMap.style.height = '25vh';
    modalInfo.style.maxHeight = '50vh';

    // Laptop screen adjustments
    if (window.matchMedia('(min-width: 769px) and (max-width: 1024px)').matches) {
        modalMap.style.height = '20vh';
        modalInfo.style.maxHeight = '55vh';
    }

    // Force map refresh
    if (modalMapInstance) {
        modalMapInstance.invalidateSize();
    }

    // Adjust text size
    adjustModalTextSize();
}


function saveDailyScore() {
    const today = new Date().toDateString();
    const dailyScores = JSON.parse(localStorage.getItem(DAILY_SCORES_KEY) || '{}');
    const finalTime = Math.min(totalGameTime, 600000);  // Maximum is 10 minutes
    dailyScores[today] = {
        score: totalScore,
        completionTime: finalTime
    };
    localStorage.setItem(DAILY_SCORES_KEY, JSON.stringify(dailyScores));
    localStorage.setItem('dailyGuesses', JSON.stringify(allGuesses));
}







function markAsPlayed() {
    const today = new Date().toDateString();
    localStorage.setItem(LAST_PLAYED_KEY, today);
}


function canPlayToday() {
    const lastPlayed = localStorage.getItem(LAST_PLAYED_KEY);
    const todayStr = new Date().toDateString();
    return lastPlayed !== todayStr;
}




function markAsPlayed() {
    const today = new Date().toDateString();
    localStorage.setItem(LAST_PLAYED_KEY, today);
}

// Timer variables
let startTime;
let timerInterval;
let elapsedTime = 0; // Track elapsed time in milliseconds
const initialTime = 120000; // 2 minutes in milliseconds
let timeLeft = initialTime; // 2 minutes in milliseconds

// In the saveGameState function, add timeLeft and lastTimerUpdate
function saveGameState() {
    const gameState = {
        currentQuestion: currentQuestion,
        allGuesses: allGuesses,
        totalScore: totalScore,
        quizStartTime: quizStartTime,
        timeLeft: timeLeft,
        lastTimerUpdate: Date.now(), // Add this to track when we saved the time
        totalGameTime: totalGameTime, // <-- Add this line to persist totalGameTime
        completed: false,
        lastAnsweredQuestion: allGuesses.length - 1,
        [LAST_PLAYED_KEY]: new Date().toDateString()
    };
    localStorage.setItem('gameState', JSON.stringify(gameState));
}
function loadGameState() {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
        const state = JSON.parse(savedState);
        const today = new Date().toDateString();

        // If we have a saved game for today which is incomplete, restore it.
        if (state[LAST_PLAYED_KEY] === today && !state.completed) {
            currentQuestion = state.allGuesses ? state.allGuesses.length : 0;
            allGuesses = state.allGuesses || [];
            totalScore = state.totalScore || 0;
            quizStartTime = state.quizStartTime;
            timeLeft = state.timeLeft || initialTime;
            totalGameTime = state.totalGameTime || 0;

            if (!allGuesses[currentQuestion]) {
                startTimer();
            }
            return true;
        }

        // If the saved game is marked complete
        if (state[LAST_PLAYED_KEY] === today && state.completed) {
            currentQuestion = questions.length;
            allGuesses = state.allGuesses || [];
            totalScore = state.totalScore || 0;
            totalGameTime = state.totalGameTime || 0;
            timeLeft = 0;
            clearInterval(timerInterval);
            return true;
        }
    }
    return false;
}







// Modify the game initialization logic
if (!loadGameState()) {
    // Initialize a new game state and save it
    currentQuestion = 0;
    allGuesses = [];
    totalScore = 0;
    quizStartTime = null;
    timeLeft = initialTime;
    saveGameState();
}
// Initial theme setup
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

function startTimer() {
    if (!quizStartTime) {
        quizStartTime = Date.now();
    }
    // Record start time for the current question
    questionStartTimes[currentQuestion] = Date.now();
    const offset = initialTime - timeLeft;
    startTime = Date.now() - offset;
    timerInterval = setInterval(updateTimer, 1000);
}



function updateQuestionTime() {
    if (questionStartTimes[currentQuestion]) {
        // Calculate elapsed time for this question, but cap it at 2 minutes (120000 ms)
        const timeSpent = Math.min(Date.now() - questionStartTimes[currentQuestion], 120000);
        totalGameTime += timeSpent;
        // Clear to avoid double-counting
        questionStartTimes[currentQuestion] = null;
    }
}



function formatCompletionTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
}



function stopTimer() {
    clearInterval(timerInterval);
}

function updateTimer() {
    const currentTime = Date.now();
    elapsedTime = currentTime - startTime;
    timeLeft = initialTime - elapsedTime;

    if (timeLeft <= 0) {
        stopTimer();
        timeLeft = 0;
        handleTimeout();
    }

    const formattedTime = formatTime(timeLeft);
    document.getElementById('timer').textContent = formattedTime;
}

function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function handleTimeout() {
    if (canGuess) {
        const correctAnswer = questions[currentQuestion].answer;
        updateQuestionTime();  // record time for this timed-out question
        canGuess = false;
        stopTimer();
        timeLeft = 0;
        
        // Get the final guess (either from marker or null)
        let finalGuess = marker ? marker.getLatLng() : null;
        allGuesses[currentQuestion] = finalGuess;
        
        // Calculate score and update displays if there was a marker
        if (finalGuess) {
            const distance = calculateDistance(finalGuess.lat, finalGuess.lng, correctAnswer[0], correctAnswer[1]);
            const roundScore = Math.max(0, Math.round(4000 * (1 - distance / 20000)));
            totalScore += roundScore;
            document.getElementById('distance').textContent = `${Math.round(distance)} km`;
        } else {
            document.getElementById('distance').textContent = `-`;
        }
        document.getElementById('score').textContent = `Score: ${totalScore}`;
        
        // Update button states
        const nextButton = document.querySelector('.next-button');
        nextButton.style.display = 'block';
        document.getElementById('submit-guess').style.display = 'none';
        nextButton.textContent = currentQuestion === questions.length - 1 ? 'See Results' : 'Next Question';
        
        // Show correct location on main map
        if (correctMarker) map.removeLayer(correctMarker);
        correctMarker = L.marker([correctAnswer[0], correctAnswer[1]], { icon: correctIcon }).addTo(map);
        
        // Show modal with correct information
        showGuessAndCorrectLocation(finalGuess, L.latLng(correctAnswer[0], correctAnswer[1]));
        
        // Save game state
        saveGameState();
    }
}





// Icon definitions
const userIcon = L.divIcon({
    className: 'user-guess-pin',
    html: `
        <div class="pin-wrapper">
            <div class="pin-head"></div>
            <div class="pin-point"></div>
        </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30]
});

const correctIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div style='background-color: #2ecc71; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;'></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6]
});






function initializeMap() {
    map = L.map('map', {
        minZoom: 2,
        maxZoom: 18,
        worldCopyJump: true,
        center: [50, 10],
        zoom: 3,
        wheelDebounceTime: 150,
        wheelPxPerZoomLevel: 120
    });
    
    // Add this after map initialization
    map.setMaxBounds([
        [-60, -Infinity],
        [80, Infinity]
    ]);

    map.on('drag', function() {
        let center = map.getCenter();
        if (center.lat > 85) {
            center.lat = 85;
            map.panTo([85, center.lng]);
        }
        if (center.lat < -85) {
            center.lat = -85;
            map.panTo([-85, center.lng]);
        }
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);
    map.scrollWheelZoom.enable();
    map.on('click', handleGuess);
    let zoomTimeout;
    map.on('zoomend', () => {
      clearTimeout(zoomTimeout);
      zoomTimeout = setTimeout(() => {
        if (correctMarker) {
          updatePinSize(map, correctMarker);
          if (line) { updateLine(); }
        }
      }, 100); // Adjust the delay (in milliseconds) as needed
    });
}


  

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function handleGuess(e) {
    if (!canGuess || !mapClickEnabled) return; // Modified this line

    const userGuess = e.latlng;
    currentGuess = userGuess;

    if (marker && map) {
        map.removeLayer(marker);
    }

    marker = L.marker([userGuess.lat, userGuess.lng], { icon: userIcon }).addTo(map);
    document.getElementById('submit-guess').style.display = 'block';
}

function showGuessAndCorrectLocation(userGuess, correctLatLng) {
    const modal = document.getElementById('info-modal');
    const modalMapContainer = document.getElementById('modal-map');
    const modalLocationInfo = document.getElementById('modal-location-info');
    const nextButton = modal.querySelector('.next-button');
    modal.style.display = 'flex';

    function handleClickOutside(event) {
        if (!modal.contains(event.target) && event.target !== nextButton) {
            event.stopPropagation();
        }
    }

    document.addEventListener('mousedown', handleClickOutside);

    const modalMap = L.map(modalMapContainer, {
        center: [20, 0],
        zoom: 2,
        minZoom: 2,
        maxZoom: 18,
        worldCopyJump: true,
        maxBounds: [[-90, -180], [90, 180]],
        maxBoundsViscosity: 1.0,
        zoomControl: true,
        dragging: true,
        touchZoom: true,
        doubleClickZoom: true,
        scrollWheelZoom: true,
        boxZoom: true,
        keyboard: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20,
    }).addTo(modalMap);

    modalMap.on('load', function() {
        setTimeout(() => {
            modalMap.invalidateSize();
        }, 100);
    });

    const correctMarker = L.marker([correctLatLng.lat, correctLatLng.lng], { icon: correctIcon }).addTo(modalMap);

    let bounds;
    let distance = 0;
    let roundScore = 0;

    // Check for either userGuess or marker (for unsubmitted pins)
    const finalGuess = userGuess || (marker ? marker.getLatLng() : null);

    if (finalGuess) {
        L.marker([finalGuess.lat, finalGuess.lng], { icon: userIcon }).addTo(modalMap);
        L.polyline([
            [finalGuess.lat, finalGuess.lng],
            [correctLatLng.lat, correctLatLng.lng]
        ], { 
            color: '#7ac5f0', 
            weight: 3, 
            opacity: 0.8, 
            smoothFactor: 1, 
            dashArray: '10', 
            className: 'animated-line' 
        }).addTo(modalMap);

        bounds = L.latLngBounds([
            [finalGuess.lat, finalGuess.lng],
            [correctLatLng.lat, correctLatLng.lng]
        ]);
        distance = calculateDistance(finalGuess.lat, finalGuess.lng, correctLatLng.lat, correctLatLng.lng);
        roundScore = Math.max(0, Math.round(4000 * (1 - distance / 20000)));
    } else {
        bounds = L.latLngBounds([
            [correctLatLng.lat, correctLatLng.lng],
            [correctLatLng.lat, correctLatLng.lng]
        ]);
    }

    let padValue = finalGuess ? (distance > 10000 ? 0.05 : distance > 5000 ? 0.1 : 0.2) : 0.5;

    setTimeout(() => {
        modalMap.invalidateSize();
        modalMap.fitBounds(bounds.pad(padValue), { 
            padding: [20, 20], 
            maxZoom: 12, 
            duration: 0.5, 
            animate: true 
        });
    }, 250);

    const currentQuestionInfo = questions[currentQuestion];

    document.querySelector('#modal-distance .distance-value').textContent = finalGuess ? `${Math.round(distance)} km` : '-';
    document.querySelector('#modal-score .score-value').textContent = finalGuess ? roundScore : '0';

    const miniTitle = document.createElement('h4');
    miniTitle.textContent = currentQuestionInfo.name;
    miniTitle.classList.add('modal-mini-title');

    modalLocationInfo.innerHTML = '';
    modalLocationInfo.innerHTML += `
        <img src="${currentQuestionInfo.image}" alt="${currentQuestionInfo.name}">
    `;
    modalLocationInfo.appendChild(miniTitle);
    modalLocationInfo.innerHTML += `
        <p>${currentQuestionInfo.info}</p>
    `;

    setTimeout(adjustModalTextSize, 0);

    nextButton.style.display = 'block';
    nextButton.onclick = () => {
        nextQuestion();
        modal.style.display = 'none';
        modalMap.remove();
        document.removeEventListener('mousedown', handleClickOutside);
    };
}




function submitGuess() {
    if (marker) {
        const userGuess = marker.getLatLng();
        const correctLatLng = questions[currentQuestion].location;
        const distance = calculateDistance(userGuess.lat, userGuess.lng, correctLatLng.lat, correctLatLng.lng);
        const points = calculateScore(distance);
        totalScore += points;
        document.getElementById('distance').textContent = `${distance.toFixed(0)} km`;
        document.getElementById('score').textContent = totalScore;
        showGuessAndCorrectLocation(userGuess, correctLatLng);
        document.getElementById('submit-guess').style.display = 'none';
    } else {
        alert('Please place a marker on the map.');
    }
}

function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        canGuess = true;
        timeLeft = initialTime;
        if (marker) map.removeLayer(marker);
        if (correctMarker) map.removeLayer(correctMarker);
        if (line) map.removeLayer(line);
        marker = null;
        currentGuess = null;
        map.setView([50, 10], 3);
        map.on('click', handleGuess);
        document.getElementById('question').textContent = questions[currentQuestion].question;
        document.getElementById('score').textContent = 'Score: -';
        document.getElementById('distance').textContent = 'Distance: -';
        adjustQuestionFontSize();
        // document.querySelector('.next-button').style.display = 'none'; // REMOVE THIS LINE
        map.dragging.enable();
        map.touchZoom.enable();
        map.doubleClickZoom.enable();
        map.scrollWheelZoom.enable();
        map.boxZoom.enable();
        map.keyboard.enable();
        if (map.tap) map.tap.enable();
        mapClickEnabled = true;
        startTimer();
    } else {
        endGame();
    }
}




document.querySelector('.next-button').addEventListener('click', function() {
    const modal = document.getElementById('info-modal');
    modal.style.display = 'none';
    const modalMapContainer = document.getElementById('modal-map');
    if (modalMapContainer) {
        const modalMap = L.map(modalMapContainer);
        modalMap.remove();
    }
    nextQuestion();
});




function showAllGuessesOnMap() {
    if (!questions || !questions.length) {
        questions = JSON.parse(localStorage.getItem('dailyQuestions') || '[]');
    }

    const mapElement = document.getElementById('map');
    mapElement.style.height = 'calc(100vh - 100px)';

    const timerContainer = document.querySelector('.timer-container-map');
    if (timerContainer) {
        timerContainer.style.display = 'none';
    }

    // Clear existing markers and lines
    if (marker) map.removeLayer(marker);
    if (correctMarker) map.removeLayer(correctMarker);
    if (line) map.removeLayer(line);

    let allPoints = [];

    questions.forEach((question, index) => {
        const correctLocation = [question.answer[0], question.answer[1]];

        // Always add correct location marker
        const correctMarker = L.marker(correctLocation, {
            icon: L.divIcon({
                className: 'end-game-pin',
                iconSize: [16, 16],
                iconAnchor: [8, 8]
            }),
            interactive: true
        }).addTo(map);
        
        // Bind the popup with autoPan options (with your preferred padding) 
        const popupContent = `
            <div class="location-info">
                <h3>${question.name}</h3>
                <img src="${question.image}" alt="${question.name}">
                <p>${question.info}</p>
            </div>
        `;
        correctMarker.bindPopup(popupContent, {
            autoPan: true,
            autoPanPadding: [50, 50]
        });

        // When the marker is clicked, force a zoom in if the map is fully zoomed out.
        // Adjust the zoom level threshold and target zoom as needed.
        correctMarker.on('click', function(e) {
            const currentZoom = map.getZoom();
            // Set threshold zoom level below which we force zoom-in (e.g., 4)
            if (currentZoom < 4) {
                map.setView(e.latlng, 6, { animate: true });
                setTimeout(() => {
                    correctMarker.openPopup();
                }, 300);
            } else {
                // Otherwise, open the popup immediately.
                correctMarker.openPopup();
            }
        });

        // Add correct location to points for bounds calculation
        allPoints.push(L.latLng(correctLocation));

        // Add user guess and line only if a guess exists for this round
        const guess = allGuesses[index];
        if (guess && guess.lat && guess.lng) {
            const userMarker = L.marker([guess.lat, guess.lng], { icon: userIcon }).addTo(map);
            allPoints.push(L.latLng(guess.lat, guess.lng));

            const line = L.polyline([
                [guess.lat, guess.lng],
                correctLocation
            ], {
                color: '#7ac5f0',
                weight: 3,
                opacity: 0.8,
                smoothFactor: 1,
                dashArray: '10',
                className: 'animated-line'
            }).addTo(map);
        }
    });

    // Fit bounds to show all points
    if (allPoints.length > 0) {
        const bounds = L.latLngBounds(allPoints);
        map.fitBounds(bounds, { padding: [50, 50] });
    }

    const endScreen = document.getElementById('end-screen');
    const endContent = document.querySelector('.end-content');
    endContent.classList.add('minimized');
    endScreen.classList.add('minimized');

    const expandButton = document.createElement('button');
    expandButton.className = 'expand-button';
    expandButton.innerHTML = '<i class="fas fa-expand-alt"></i>';
    expandButton.onclick = () => {
        endContent.classList.remove('minimized');
        endScreen.classList.remove('minimized');
        expandButton.remove();
        mapElement.style.height = 'calc(100vh - 200px)';
        requestAnimationFrame(() => {
            setTimeout(() => {
                map.invalidateSize();
                mapClickEnabled = true;
                map.dragging.enable();
                map.touchZoom.enable();
                map.doubleClickZoom.enable();
                map.scrollWheelZoom.enable();
                map.boxZoom.enable();
                map.keyboard.enable();
                if (map.tap) map.tap.enable();
                map.on('click', handleGuess);
            }, 0);
        });
    };
    endContent.appendChild(expandButton);
    mapElement.style.height = 'calc(100vh - 80px)';
    map.invalidateSize();
    map.dragging.enable();
    map.touchZoom.enable();
    map.doubleClickZoom.enable();
    map.scrollWheelZoom.enable();
    map.boxZoom.enable();
    map.keyboard.enable();
    if (map.tap) map.tap.enable();
    mapClickEnabled = false;
    map.off('click', handleGuess);
}



function shareResults() {
    if (!questions || !questions.length) {
        questions = JSON.parse(localStorage.getItem('dailyQuestions') || '[]');
    }

    const dailyData = JSON.parse(localStorage.getItem(DAILY_SCORES_KEY) || '{}')[new Date().toDateString()];
    const completionTime = formatCompletionTime(dailyData.completionTime);
    const quizNumber = getDailyQuizNumber();
    
    let shareText = `CartoObscura #${quizNumber}\n\nFinal Score: ${totalScore}\nTime: ${completionTime}\n\n`;
    let scoreIcons = '';
    
    allGuesses.forEach((guess, index) => {
        const correctAnswer = questions[index].answer;
        let distance = null;
        if (guess && guess.lat && guess.lng) {
            distance = calculateDistance(guess.lat, guess.lng, correctAnswer[0], correctAnswer[1]);
        }
        let icon = '❌';
        if (distance !== null) {
            if (distance <= 50) icon = '🎯';
            else if (distance <= 300) icon = '🟢';
            else if (distance <= 1000) icon = '🟡';
            else if (distance <= 2000) icon = '🟠';
            else if (distance <= 4000) icon = '🔴';
        }
        scoreIcons += icon;
    });
    
    shareText += `${scoreIcons}\n\nPlay at: CartoObscura.com`;

    // Only use navigator.share on mobile devices
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        if (navigator.share) {
            navigator.share({
                title: 'Todays Results',
                text: shareText
            }).catch(() => {
                copyToClipboard(shareText);
            });
        } else {
            copyToClipboard(shareText);
        }
    } else {
        copyToClipboard(shareText);
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
            const button = document.getElementById('share-results');
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            setTimeout(() => {
                button.textContent = originalText;
            }, 2000);
        })
        .catch(() => alert('Unable to share results'));
}



function endGame() {
    if (questionStartTimes[currentQuestion]) {
        updateQuestionTime();
    }

    currentQuestion = questions.length;
    const gameState = {
        completed: true,
        currentQuestion: currentQuestion,
        allGuesses: allGuesses,
        totalScore: totalScore,
        totalGameTime: totalGameTime,
        [LAST_PLAYED_KEY]: new Date().toDateString()
    };
    localStorage.setItem('gameState', JSON.stringify(gameState));
    localStorage.setItem('dailyGuesses', JSON.stringify(allGuesses));

    stopTimer();
    timeLeft = 0;
    clearInterval(timerInterval);

    saveDailyScore();

    // Rest of your existing endGame code...
    // Just ensure you're using totalGameTime for the completion time display
    const finalGameTime = Math.min(totalGameTime, 600000);
    const formattedCompletionTime = formatCompletionTime(finalGameTime);

    const statsContainer = document.querySelector('.stats-container');
    const questionContainer = document.getElementById('question-container');
    const placeholder = document.createElement('div');
    placeholder.style.height = questionContainer.offsetHeight + 'px';
    placeholder.id = 'question-placeholder';
    questionContainer.parentNode.replaceChild(placeholder, questionContainer);
    statsContainer.style.display = 'none';

    const endScreen = document.getElementById('end-screen');
    const finalScoreElement = document.getElementById('final-score');
    const finalStats = document.getElementById('final-stats');
    const finalTime = document.getElementById('final-time');

    let totalDistance = 0;
    let guessDetails = '';
    questions.forEach((question, index) => {
        const guess = allGuesses[index];
        let distance = null;
        if (guess) {
            distance = calculateDistance(guess.lat, guess.lng, question.answer[0], question.answer[1]);
        }
        totalDistance += distance === null ? 0 : distance;
        const distanceValue = distance === null ? '-' : Math.round(distance);
        let icon = '';

        if (distance === null || distanceValue === '-') {
            icon = '<i class="fas fa-times red-x"></i>';
        } else if (distance <= 50) {
            icon = '<span class="bullseye-emoji">🎯</span>';
        } else if (distance <= 300) {
            icon = '<i class="fas fa-circle green-circle"></i>';
        } else if (distance <= 1000) {
            icon = '<i class="fas fa-circle yellow-circle"></i>';
        } else if (distance <= 2000) {
            icon = '<i class="fas fa-circle orange-circle"></i>';
        } else if (distance <= 4000) {
            icon = '<i class="fas fa-circle red-circle"></i>';
        } else {
            icon = '<i class="fas fa-times red-x"></i>';
        }

        guessDetails += `
            <div class="guess-detail">
                ${index + 1}. Distance: ${distanceValue} km ${icon}
            </div>
        `;
    });

    const maxPossibleDistance = 12000;
    const accuracyWeight = 1.5;
    const penaltyFactor = 1.2;
    const baseMultiplier = 0.9;
    const averageDistance = totalDistance / questions.length;
    const accuracy = Math.max(0, baseMultiplier * 100 * Math.pow((1 - (averageDistance / maxPossibleDistance) * penaltyFactor), accuracyWeight));

    finalScoreElement.textContent = `Final Score: ${totalScore}`;
    finalTime.textContent = `Completion Time: ${formattedCompletionTime}`;
    finalStats.innerHTML = `
        <div class="accuracy">Overall Accuracy: ${accuracy.toFixed(1)}%</div>
        <div class="guess-history">
            <h3>Your Guesses:</h3>
            ${guessDetails}
        </div>
    `;

    endScreen.style.display = 'flex';
    const endButtons = document.querySelector('.end-buttons');
    endButtons.innerHTML = `
        <button id="see-results-map" class="end-button">See Results on Map</button>
        <button id="share-results" class="end-button">Share Results</button>
    `;

    document.getElementById('see-results-map').addEventListener('click', showAllGuessesOnMap);
    document.getElementById('share-results').addEventListener('click', shareResults);
    mapClickEnabled = false;
}








function adjustQuestionFontSize() {
    const questionElement = document.getElementById('question');
    if (!questionElement) return;
    const textLength = questionElement.textContent.length;
    let fontSize = '1rem'; // Default font size
    if (textLength > 100) {
        fontSize = '0.8rem';
    } else if (textLength > 80) {
        fontSize = '0.9rem';
    }
    questionElement.style.fontSize = fontSize;
}

// ... (Existing code) ...

document.addEventListener('DOMContentLoaded', () => {
    try {
        const dailyCreditsContainer = document.getElementById('daily-credits');
        if (dailyCreditsContainer) {
            const todayCredits = getDailyImageCredit();
            // todayCredits will be one array of 5 credits for the current day
            todayCredits.forEach(credit => {
                const creditElement = document.createElement('p');
                creditElement.textContent = credit;
                creditElement.style.marginBottom = '8px'; // Add some spacing between credits
                dailyCreditsContainer.appendChild(creditElement);
            });
        }
        // START BUTTON LOGIC
        const startButton = document.getElementById('start-game');

        // Retrieve saved game state (if any)
        const savedState = JSON.parse(localStorage.getItem('gameState') || '{}');
        // Check if a saved game exists AND it’s from today (i.e. !canPlayToday() returns true)
        if ( Object.keys(savedState).length > 0 && !canPlayToday() ) {
            if (savedState.completed) {
                // If the game is completed, show "Show Today's Results"
                startButton.classList.add('played');
                startButton.innerHTML = '<span>Show Today\'s Results</span>';
            } else {
                // If the game is incomplete, show "Continue Game"
                startButton.classList.add('continue');
                startButton.innerHTML = '<span>Continue Game</span>';
                // Load the saved questions if they exist
                questions = JSON.parse(localStorage.getItem('dailyQuestions') || '[]');
                // Load the question if the game is continued
                if (loadGameState() && currentQuestion < questions.length && currentQuestion >= 0) {
                    document.getElementById("question").textContent = questions[currentQuestion].question;
                    adjustQuestionFontSize();
                }
            }
        } else {
            // If there's no saved gameState or it's a new day, show "Start Quiz"
            startButton.innerHTML = '<span>Start Quiz</span>';
        }

        // THEME TOGGLE & RESIZE LISTENER
        window.addEventListener('resize', adjustModalTextSize);

        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.checked = localStorage.getItem('theme') === 'dark';
            themeToggle.addEventListener('change', () => {
                const newTheme = themeToggle.checked ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
            });
        }

        // START GAME BUTTON CLICK HANDLER
        startButton.onclick = function () {
            // Clear any existing game state
            localStorage.removeItem('gameState');
            localStorage.removeItem('dailyGuesses');
            
            const heroContainer = document.querySelector('.hero-container');
            const gameSection = document.getElementById('game-section');
            
            heroContainer.style.display = "none";
            gameSection.style.display = "block";
            initializeMap();
        
            // Reset game variables
            currentQuestion = 0;
            allGuesses = [];
            totalScore = 0;
            
            // Mark as played and start new game
            markAsPlayed();
            localStorage.setItem('dailyQuestions', JSON.stringify(questions));
            document.getElementById("question").textContent = questions[currentQuestion].question;
            adjustQuestionFontSize();
            startTimer();
        };
        
        

        // ADDITIONAL EVENT LISTENER FROM SECOND DOMContentLoaded
        const openModalButton = document.getElementById('open-modal-button');
        if (openModalButton) {
            openModalButton.addEventListener('click', showModal);
        }

        const endScreen = document.getElementById('end-screen');
        if (endScreen) {
            const seeResultsBtn = endScreen.querySelector('#see-results-map');
            const shareResultsBtn = endScreen.querySelector('#share-results');
            if (seeResultsBtn) {
                seeResultsBtn.addEventListener('click', showAllGuessesOnMap);
            }
            if (shareResultsBtn) {
                shareResultsBtn.addEventListener('click', shareResults);
            }
        }
    } catch (error) {
        console.error("Error during DOMContentLoaded:", error);
    }
});


 // Final closing bracket for DOMContentLoaded


 document.getElementById('submit-guess').addEventListener('click', function() {
    updateQuestionTime();  // Record time for the current question
    saveGameState();       // Persist state immediately
    
    if (!currentGuess) return;
    
    // Lock this question by disabling further input and stopping the timer.
    canGuess = false;
    stopTimer();

    const correctAnswer = questions[currentQuestion].answer;
    const distance = calculateDistance(currentGuess.lat, currentGuess.lng, correctAnswer[0], correctAnswer[1]);
    
    // Record this answer to lock-in the response for this question.
    allGuesses.push(currentGuess);
    saveGameState(); // Update storage with the latest answer so a refresh won’t allow re-answering.
    
    const nextButton = document.querySelector('.next-button');
    nextButton.style.display = 'block';
    this.style.display = 'none';
    
    if (currentQuestion === questions.length - 1) {
        nextButton.textContent = 'See Results';
    } else {
        nextButton.textContent = 'Next Question';
    }
    
    const score = Math.max(0, Math.round(4000 * (1 - distance / 20000)));
    totalScore += score;
    
    // New animation code
    const scoreBox = document.querySelector('.stat-box:nth-child(2)');
    const distanceBox = document.querySelector('.stat-box:nth-child(1)');
    
    document.getElementById('score').textContent = `Score: ${totalScore}`;
    document.getElementById('distance').textContent = `Distance: ${Math.round(distance)} km`;
    
    scoreBox.classList.add('reveal');
    distanceBox.classList.add('reveal');
    
    setTimeout(() => {
        scoreBox.classList.remove('reveal');
        distanceBox.classList.remove('reveal');
    }, 1500);
    
    showGuessAndCorrectLocation(currentGuess, L.latLng(correctAnswer[0], correctAnswer[1]));
});

window.addEventListener('beforeunload', saveGameState);






function adjustMapBounds(marker) {
    const bounds = marker.getBounds();
    const padding = 50; // Adjust padding as needed
    map.fitBounds(bounds.pad(0.1), {
        padding: [padding, padding],
        maxZoom: 18,
        animate: true,
        duration: 0.5
    });
}

function handleGuessSubmission(distance, score) {
    const scoreBox = document.querySelector('.stat-box:nth-child(2)');
    const distanceBox = document.querySelector('.stat-box:nth-child(1)');
    
    // Update the values
    document.getElementById('distance').textContent = `${Math.round(distance)} km`;
    document.getElementById('score').textContent = score;
    
    // Add the reveal animation
    scoreBox.classList.add('reveal');
    distanceBox.classList.add('reveal');
    
    // Remove the animation class after it completes
    setTimeout(() => {
        scoreBox.classList.remove('reveal');
        distanceBox.classList.remove('reveal');
    }, 1500);
}

function submitGuess() {
    if (marker) {
        const userGuess = marker.getLatLng();
        const correctLatLng = questions[currentQuestion].location;
        const distance = calculateDistance(userGuess.lat, userGuess.lng, correctLatLng.lat, correctLatLng.lng);
        const points = calculateScore(distance);
        totalScore += points;
        document.getElementById('distance').textContent = `${distance.toFixed(0)} km`;
        document.getElementById('score').textContent = totalScore;
        showGuessAndCorrectLocation(userGuess, correctLatLng);
        document.getElementById('submit-guess').style.display = 'none';
    } else {
        alert('Please place a marker on the map.');
    }
}

function adjustModalContent() {
    const modalMap = document.getElementById('modal-map');
    const modalInfo = document.querySelector('.modal-info');

    // Default sizes
    modalMap.style.height = '25vh';
    modalInfo.style.maxHeight = '50vh';

    // Laptop screen adjustments
    if (window.matchMedia('(min-width: 769px) and (max-width: 1024px)').matches) {
        modalMap.style.height = '20vh';
        modalInfo.style.maxHeight = '55vh';
    }

    // Force map refresh
    if (modalMapInstance) {
        modalMapInstance.invalidateSize();
    }

    // Adjust text size
    adjustModalTextSize();
}




function openModal() {
    const modal = document.getElementById('myModal');
    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('myModal');
    modal.style.display = 'none';
}

function adjustModalTextSize() {
    const modalInfo = document.querySelector('.modal-info p');
    const modalContainer = document.querySelector('.modal-info');
    
    if (!modalInfo || !modalContainer) return;
    
    // Reset font size to measure natural height
    modalInfo.style.fontSize = '0.9rem';
    
    // Get the container's height and the text content height
    const containerHeight = modalContainer.clientHeight;
    const textHeight = modalInfo.scrollHeight;
    
    // Calculate ratio between container and text height
    const ratio = containerHeight / textHeight;
    
    // If text is too large for container
    if (ratio < 1) {
        // Calculate new font size (with a minimum of 0.6rem)
        const newSize = Math.max(0.6, 0.9 * ratio);
        modalInfo.style.fontSize = `${newSize}rem`;
    }
}

function adjustModalSize() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    const modalContent = document.querySelector('.modal-content');
    const modalMap = document.querySelector('#modal-map');
    const modalInfo = document.querySelector('.modal-info');
    
    // Adjust map size based on screen height
    const mapHeight = window.innerHeight <= 700 ? '45vh' 
        : window.innerHeight <= 900 ? '50vh' 
        : '55vh';
    
    modalMap.style.height = mapHeight;
    
    // Adjust content padding and spacing
    const contentPadding = window.innerWidth <= 480 ? '8px' : '16px';
    
    modalContent.style.padding = contentPadding;
}

window.addEventListener('resize', adjustModalSize);
window.addEventListener('load', adjustModalSize);

document.addEventListener('DOMContentLoaded', () => {
    const aboutToggle = document.querySelector('.about-toggle');
    const aboutContent = document.querySelector('.about-content');

    aboutToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        aboutContent.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!aboutContent.contains(e.target)) {
            aboutContent.classList.remove('active');
        }
    });
});


