import {SearchRequest} from "../model";
import {SERVER_URL} from "../global";

export async function getNavigation(start, end) {
    let data = await fetch(SERVER_URL + 'navigation', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify(new SearchRequest(start, end)),
    }).then(res => res.json());
    console.log(data);
    return data;
}
