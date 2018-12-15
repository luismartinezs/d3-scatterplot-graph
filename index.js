// Fetch the data from a remote point
const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';
req = new XMLHttpRequest();
req.open('GET', url, true);
req.onload = () => {
    json = JSON.parse(req.responseText);
    console.log(json);
}
req.send();

