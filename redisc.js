LLMD.registerPackage("redisc", {
  shema: [{
    data: {
      type: String,
      defaultValue: ''
    },
    title: {
      type: String,
      defaultValue: ''
    },
    code: {
      type: String,
      defaultValue: ''
    },
    upvotes: {
      type: [String],
      defaultValue: []
    },
    downvotes: {
      type: [String],
      defaultValue: [] 
    },
    score: {
      type: Number,
      defaultValue: 0
    },
    nested: {
      type: [String],
      defaultValue: []
    },
    comments: {
      type: Number,
      defaultValue: 0
    },
    tags: {
      type: [String],
      defaultValue: 0
    },
    root: {
      type: String,
      defaultValue: ''
    },
    createdOn: {
      type: Date,
      autoValue: function(){
        return new Date();
      }
    },
    updatedOn: {
      type: Date,
      autoValue: function(){
        return new Date();
      }
    },
    user: {
      type: Object
    },
    "user.name": {
      type: String,
      autoValue: function(){
        return Meteor.user().profile.name;
      }
    },
    "user._id": {
      type: String,
      autoValue: function(){
        return Meteor.userId();
      }
    }
  }],
  nested: ['nested'],
  // [TODO] - is it really nessesery?
  // dataFilter: function( params, rawData ){
  //   var data = "";
  //     
  //   if( rawData.length && rawData.length>0 ) {
  //     for( var i in rawData ) {
  //       data+= rawData[i].data;
  //     }
  //   }
  //   
  //   return data;
  // },
  
  
  
  // is fired on an atom inside the collection
  preprocess: function( ast, cb ){
    
    ast.updatedOn = new Date();
    
    if( ast.root ) {
      Atoms.update({_id: ast.root},{ 
        $set: { updatedOn: new Date()},
        $inc: { comments: 1 }
      });
    } else {
      ast.comments += 1;
    }
    
    // each tag
    ast.tags && ast.tags.forEach( function( tag ){
      var tagO = GlobalTags.findOne({ _id: tag });
      if( !tagO ) GlobalTags.insert({ _id: tag, _remoteIds: [ ast._id ], rate:1 });
      else if( tagO._remoteIds.indexOf( ast._id ) == -1 ) {
        GlobalTags.update({_id: tag}, { 
          $addToSet:{ _remoteIds: ast._id }, 
          $inc: { rate: 1 } 
        });
      }
     
    });
    
    cb( null, ast );
    
  }
});
