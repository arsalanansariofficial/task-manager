window.onload = function () {
  function readURL(input) {
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const imagePreview = $('#imagePreview');
        imagePreview.css('background-image', 'url(' + e.target.result + ')');
        imagePreview.hide();
        imagePreview.fadeIn(5000);
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  $('#imageUpload').change(function () {
    readURL(this);
  });
};
