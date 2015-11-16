$("input[type='file']").change(function() {
    var fileName = $(this).val();
    $("#file-name").html("<strong>Path</strong>: " + fileName + "<a href='' class='x-link'><span class='glyphicon glyphicon-remove pull-right remove-icon'></span></a>");
    $("#remote_repository").prop('disabled', true);
});