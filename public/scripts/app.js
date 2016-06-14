(function(document){
    'use strict'
    
    var app = document.querySelector("#app");

    app.name = "My Blog";

    app.settingsToggle = function(){
      app.$.settingsDialog.toggle();
    };

    app.pushSettingChanged = function(){
        console.log("here mabyer");
        
        window.navigator.serviceWorker.ready.then(function(reg){
            console.log("got herer");

            if(app.pushSubscription){
                console.log("unsubscribing from push messaaging")
                app.pushSubscription.unsubscribe();

                var database = firebase.database();
                var subId = app.pushSubscription.endpoint.slice(app.pushSubscription.endpoint.indexOf('send') + 5);

                database.ref('subscribers/' + subId).set(
                    false
                );

            } else {
                reg.pushManager.subscribe({
                    userVisibleOnly: true
                }).then(function (subscription) {
                    app.pushSubscription = subscription;
                    var subId = subscription.endpoint.slice(subscription.endpoint.indexOf('send') + 5);
                    console.log(subId);
                    console.log(subscription.endpoint);

                    var database = firebase.database();

                    database.ref('subscribers/' + subId).set(
                        true
                    );

                });
            }
        });
    };

    // Get a reference to the database service
    var database = firebase.database();

    database.ref('posts/').limitToLast(3).on('value', function(posts){
        var posts = posts.val();
        app.posts = Object.keys(posts).map(function(propName){ return posts[propName]});
    });


    if('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('/sw.js')
            .then(function(reg) {
                console.log('Service Worker Registered');
                reg.pushManager.getSubscription().then(function(pushSub){
                   app.pushSubscription =  pushSub;
                });
            });
    }
})(document);