import {SearchRequest} from "../model";
import {SERVER_URL} from "../global";

async function getNavigation(start, end) {
    let data = await fetch(SERVER_URL + 'navigation', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        data: new SearchRequest(start, end),
        mode: 'cors',
        cache: 'default'
    }).then(res => res.json());
    console.log(data);
    return data;
}
