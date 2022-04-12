$(document).ready(function(){ 
    $(function() {
        var modal = $('#cropper-modal');
        var filename;
        $('.close').on('click', function () { closeModal(); });
        $('input[type=file]').fileupload({
            dataType: 'json',
            add: function (e, data) { data.submit();},
            done: function (e, data) { 
                if (data.result.file) {  openModal('#photoEditorModal'); } 
                  else if(data.result.status&&data.result.status=='error') { console.log([data.result.message]); return; } 
                  else {alert('upload error'); }
                }
        });
    });
}); //ready

