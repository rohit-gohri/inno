/**
 * Created by Lenovo on 2/21/2016.
 */

var endpoint;

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('serviceWorker.js').then(function (reg) {
        console.log(':^)', reg);
        reg.pushManager.subscribe({
            userVisibleOnly: true
        }).then(function (sub) {

            endpoint = sub.endpoint;
            console.log(endpoint);
        });
    }).catch(function (error) {
        console.log(':^(', error);
    });
}