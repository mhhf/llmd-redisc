// newAtom(type)



RediscPlugin = BasicPlugin.extend({
  render: function(){
    var divWrapper = document.createElement('div');
    divWrapper.innerHTML = marked( this.data );
    return divWrapper;
  }
});

PluginHandler.registerPlugin( "md", RediscPlugin );



var tags = [];
Template.llmd_redisc_edit.rendered = function(){
  
  var self = this;
  console.log(this);
  
  var atom = this.data.get && this.data.get();
  
  var data = ( atom && atom.data ) || ''; 
  // var code = ( this.data.atom && this.data.atom.code ) || ''; 
  
  var dataEditor = CodeMirror(this.find('#editor'),{
    value: data,
    mode:  "markdown",
    lineNumbers: true,
    lines: 10
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
  }
});

Template.llmd_redisc_ast.rendered = function(){
}

Template.llmd_redisc_ast.helpers({
});
