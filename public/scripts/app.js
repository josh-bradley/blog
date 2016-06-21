(function(document){
  'use strict'

  var app = document.querySelector("#app");

  app.name = "My Blog";
  app.serviceWorkerEnabled = false;

  app.observers = ['newPosts(posts)']

  app.settingsToggle = function(){
    app.$.settingsDialog.toggle();
  };

  app.pushSettingChanged = function(){
    window.navigator.serviceWorker.ready.then(function(reg){
      var database = firebase.database();

      if(app.pushSubscription){
        var subId = app._getPushMessageSubId();

        app.pushSubscription.unsubscribe();
        app.pushSubscription = null;
        database.ref('subscribers/' + subId).remove();
      } else {
        reg.pushManager.subscribe({
          userVisibleOnly: true
        }).then(function (subscription) {
          app.pushSubscription = subscription;

          var subId = app._getPushMessageSubId();
          console.log(subId);

          database.ref('subscribers/' + subId).set(
            true
          );

        });
      }
    });
  };

  app._getPushMessageSubId = function(){
    return app.pushSubscription.endpoint.slice(app.pushSubscription.endpoint.indexOf('send') + 5);
  };

  app.newPosts = function(posts){
    console.log("got new posts: " + posts.length);

    posts.forEach(function(post){
      app.async(function(){
        var cardBody = document.querySelector("#" + post.id + " .post-body");

        cardBody.innerHTML = post.body;
      }, 0);

    });
  };

  app.refreshPage = function(){
    window.location.reload();
  };
      
  // Get a reference to the database service
  var database = firebase.database();

  database.ref('posts/').limitToLast(3).on('value', function(posts){
    var posts = posts.val();
    app.posts = Object.keys(posts).map(function(propName){
      var post = posts[propName]
      post.id = "_" + propName;
      post.dateString = moment(post.postedOn).format("MMM Do YY");
      return post;
    });
  });


  if('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/sw.js')
      .then(function(reg) {
        reg.onupdatefound = function() {
          var installingWorker = reg.installing;
          installingWorker.onstatechange = function () {
            if(installingWorker.state == 'installed') {
                if (navigator.serviceWorker.controller) {
                  app.$.swUpdateToast.show();
                }
            }
          }
        };

        console.log('Service Worker Registered');
        reg.pushManager.getSubscription().then(function(pushSub){
          app.pushSubscription =  pushSub;
        });

        app.serviceWorkerEnabled = true;
      });
  }
})(document);
