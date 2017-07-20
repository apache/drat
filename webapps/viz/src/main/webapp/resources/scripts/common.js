// Global Params
SOLR_URL = "/solr/statistics";

function getDate() {
	var now = new Date();
	var dd = now.getDate();
	var mm = now.getMonth() + 1;
	var yyyy = now.getFullYear();

	if(dd < 10)
		dd = '0' + dd;

	if(mm < 10)
		mm = '0' + mm;

	return yyyy + "-" + mm + "-" + dd;
}

function toTitleCase(string)
{
    // \u00C0-\u00ff for a happy Latin-1
    return string.toLowerCase().replace(/_/g, ' ').replace(/\b([a-z\u00C0-\u00ff])/g, function (_, initial) {
        return initial.toUpperCase();
    }).replace(/(\s(?:de|a|o|e|da|do|em|ou|[\u00C0-\u00ff]))\b/ig, function (_, match) {
        return match.toLowerCase();
    });
}

function getEpochTime(dateTime) {
	var date = dateTime.split("T")[0];
	var yyyy = date.split("-")[0];
	var mm = date.split("-")[1];
	var dd = date.split("-")[2];

	// Subtracting 1 to match the d3 format
	return new Date(yyyy, mm - 1, dd).getTime();
}

function splitGeo(data){
    parts = data.trim().split(",");
    if (parts.length == 2) {
        return [parseFloat(parts[0]), parseFloat(parts[1])];
    }
    console.error("Couldn't split the geo into lat and long");
    return null;
}

function geoPointTransform(facet) {
    coords = splitGeo(facet.term);
    if (coords) {
        facet['lat'] = coords[0];
        facet['lon'] = coords[1];
    }
    return facet;
}

function getSolrFacet(res, fieldName, transformFunc) {
    tmp = res;
    if ('facet_counts' in tmp) {
        tmp = tmp['facet_counts'];
        if ('facet_fields' in tmp){
            tmp = tmp['facet_fields'];
            if (fieldName in tmp) {
                arr = tmp[fieldName];
                list = [];
                for( var i=0; i < arr.length - 1; i++){
                    obj = {};
                    obj['term'] = arr[i];
                    obj['count'] = arr[i + 1];
                    if (transformFunc){
                        obj = transformFunc(obj)
                    }
                    list.push(obj);
                    i++;
                }

                return list
            }
        }
    }
    return null
}
