// newAtom(type)



RediscPlugin = BasicPlugin.extend({
  render: function(){
    var divWrapper = document.createElement('div');
    divWrapper.innerHTML = marked( this.data );
    return divWrapper;
  }
});

PluginHandler.registerPlugin( "md", RediscPlugin );



Template.llmd_redisc_edit.events = {
  
  "click .btn.editorView": function(e,t){
    e.preventDefault();
    
    var target = e.currentTarget.dataset.target;
    
    if( target != this._active ) {
      this._active = target;
      this._editorDeps.changed();
    }
    
    
  }
  
}

Template.llmd_redisc_edit.created = function(){
  
  this.data._editorDeps = new Deps.Dependency;
  this.data._valueDeps = new Deps.Dependency;
  this.data._active = 'editor';
  this.data._data = '';
  this.data._updateInterval;
  this.data._lastEdit;
  
}

var tags = [];
Template.llmd_redisc_edit.rendered = function(){
  
  var self = this;
  
  var atom = this.data.get && this.data.get();
  
  var data = ( atom && atom.data ) || ''; 
  // var code = ( this.data.atom && this.data.atom.code ) || ''; 
  
  var dataEditor = CodeMirror(this.find('#editor'),{
    value: data,
    mode:  "markdown",
    lineNumbers: true,
    lines: 10
  });
  
  dataEditor.on('change', function(cm){
    self.data._data = cm.getValue();
    if( !self.data._updateInterval ) {
      self.data._updateInterval = setInterval( function(){
        self.data._valueDeps.changed();
        if(+new Date() - self.data._lastEdit > 1000 ) {
          clearInterval( self.data._updateInterval );
          self.data._updateInterval = null;
        }
      },1000);
    }
    self.data._lastEdit = +new Date(); 
  });
  
  // var codeEditor = CodeMirror(this.find('.codeEditor'),{
  //   value: code,
  //   mode:  "javascript",
  //   theme: "monokai",
  //   lineNumbers: true,
  //   lines: 10
  // });
  
  $('select').selectize({
    create: true, 
    onChange: function(t){
      tags = t;
    }
  });
  
  this.data.buildAtom = function(){
    var title = self.find('input[name=title]') && self.find('input[name=title]').value;
    
    return {
      data: dataEditor.getValue(),
      // code: codeEditor.getValue(),
      tags: tags,
      title: title
    }
  }
  
}

Template.llmd_redisc_edit.helpers({
  getEditorData: function(){
    this._valueDeps.depend();
    var self = this;
    return new function(){
      this.get= function(){
        return {data:self._data};
      }
    };
    
  },
  isRoot: function(){
    var atom = this && this.get && this.get();
    return !atom || atom.root == '';
  },
  getTitle: function(){
    var atom = this && this.get && this.get();
    return atom && atom.title;
  },
  getTags: function(){
    var atom = this && this.get && this.get();
    return atom && atom.tags;
  },
  isActive: function( key ){
    this._editorDeps.depend();
    return this._active == key?'active':'';
  },
  getEditorClass: function(){
    this._editorDeps.depend();
    if( this._active == 'editor' ) {
      return 'full';
    } else if( this._active == 'split' ) {
      return 'split';
    } else {
      return 'none'
    }
  },
  getViewClass: function(){
    this._editorDeps.depend();
    if( this._active == 'preview' ) {
      return 'full';
    } else if( this._active == 'split' ) {
      return 'splitPreview';
    } else {
      return 'none'
    }
  }
});

Template.llmd_redisc_ast.rendered = function(){
}

Template.llmd_redisc_ast.helpers({
});
