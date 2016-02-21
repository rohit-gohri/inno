/**
 * Created by Lenovo on 2/21/2016.
 */

var endpoint;

if ('serviceWorker' in navigator) {
    console.log('Service Worker is supported');
    navigator.serviceWorker.register('serviceWorker.js').then(function (reg) {
        console.log(':^)', reg);
        reg.pushManager.subscribe({
            userVisibleOnly: true
        }).then(function (sub) {
            endpoint = sub.endpoint;
            document.getElementById('endpoint').value = sub.endpoint;
        });
    }).catch(function (error) {
        console.log(':^(', error);
    });
}