LLMD.registerPackage("redisc", {
  init: function(){
    this.data = '';
    this.title = '';
    this.code = '';
    
    this.upvotes = [];
    this.downvotes = [];
    this.score = 0;
    
    // [TODO] - refactor nested to children
    this.nested = [];
    this.comments = 0;
    
    this.tags = [];
    this.root = '';
    
    this.createdOn = new Date();
    this.updatedOn = new Date();
    
    
    var usr = Meteor.user();
    
    this.user = {
      name: usr.username || usr.profile && usr.profile.name,
      _id: Meteor.userId()
    }
    
    
  },
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
      console.log('tag', tag);
      var tagO = GlobalTags.findOne({ _id: tag });
      if( !tagO ) GlobalTags.insert({ _id: tag, _remoteIds: [ ast._id ], rate:1 });
      else if( tagO._remoteIds.indexOf( ast._id ) == -1 ) {
        console.log('tag found', tagO.rate);
        GlobalTags.update({_id: tag}, { 
          $addToSet:{ _remoteIds: ast._id }, 
          $inc: { rate: 1 } 
        });
      }
     
    });
    
    cb( null, ast );
    
  }
});
