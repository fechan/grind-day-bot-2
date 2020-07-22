const fs = require('fs');
const parse = require('csv-parse');

//Get directories in trekdata, where the CSVs are
const seriesDirs = fs.readdirSync('data/trekdata', { withFileTypes: true }) 
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

//Load and parse CSV data into trekData
let trekData = {}; //{'DS9': [['5x06', 'Trials and Tribble-ations']]}
for (const series of seriesDirs) {
    let seasonFiles = fs.readdirSync('data/trekdata/' + series)
        .filter(file => file.endsWith('.csv'));
    let seriesKey = series.toUpperCase();
    trekData[seriesKey] = [];
    for (const season of seasonFiles) {
        fs.createReadStream(`data/trekdata/${series}/${season}`)
            .pipe(parse())
            .on('data', row => {
                if (row[0].includes('x')) { //Omits rows which are just labels, not actual data
                    trekData[seriesKey].push([row[0], row[1]]);
                }
            });
    }
    if ('DSC' in trekData) {
        trekData['STD'] = trekData['DSC']; //Recognize DSC as STD as well
    }
}

module.exports = {
    name: 'trekepisode',
    aliases: ['st', 'trek'],
    description: 'Fetch an episode of Star Trek by show and episode reference. (e.g. DS9 6x09)',
    args: true,
    usage: '<series abbreviation> <SEASON>x<EPISODE>',
    execute(message, args) {
        let series = args[0].toUpperCase();
        let episode;

        let episodeMatches;
        let title;
        if (!(series in trekData)) {
            message.reply("Invalid Star Trek series: " + args[0]);
            return;
        } else if (/\d+x\d+/.test(args[1])) { //if episode is SEASONxEPISODE format
            episode = args[1];
            let episodeNumber = episode.split('x')[1];
            let seasonNumber = episode.split('x')[0];
            if (episodeNumber.length === 1) {
                episodeNumber = '0' + episodeNumber;
            }
            episodeMatches = trekData[series].filter(releasedEpisode => {
                let season = releasedEpisode[0].split('x')[0];
                let number = releasedEpisode[0].split('x')[1];
                return season === seasonNumber && number.includes(episodeNumber)
            });
        } else {
            episode = args.slice(1).join(" ");
            episodeMatches = trekData[series].filter(releasedEpisode => {
                return releasedEpisode[1].toUpperCase() === episode.toUpperCase();
            });
        }
        
        if (episodeMatches.length === 0) {
            message.reply(`Couldn't find ${series} episode ${episode}!`);
            return;
        }
        title = episodeMatches[0][1];
        let memAlpha = `https://memory-alpha.fandom.com/wiki/${title.replace(/ /g, '_')}_(episode)`
        message.reply(`${series} ${episode} is ${title} \n${memAlpha}`);
    },
};