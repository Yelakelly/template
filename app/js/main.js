$(document).ready(function(){

  function scrollTo(item, offset){
    var offset = offset || 0;

    $('html, body').animate({
        scrollTop: $(item).offset().top - offset
    }, 1000);
  }

  function repositionBlocks(top, bottom, screenSize){
    $(window).width() < screenSize ? top.insertAfter(bottom) : bottom.insertAfter(top);
  }

  repositionBlocks($('.catalog-content__left'), $('.catalog-content__right'), 834);
  repositionBlocks($('.site-footer__left'), $('.site-footer__right'), 1004);

  $(window).resize(function(){
    repositionBlocks($('.catalog-content__left'), $('.catalog-content__right'), 834);
    repositionBlocks($('.site-footer__left'), $('.site-footer__right'), 1004);
  });

  $('.advantages-carousel').slick({
    arrows: true,
    prevArrow: '<div class="advantages-carousel__button advantages-carousel__button--left"><div><i class="icon-left-arrow"></i></div></div>',
    nextArrow: '<div class="advantages-carousel__button advantages-carousel__button--right"><div><i class="icon-right-arrow"></i></div></div>',
    infinite: false,
    fade: true,
    cssEase: 'ease',
    dots: false
  });

  $('.catalog-carousel').slick({
    arrows: true,
    prevArrow: '<div class="catalog-carousel__button catalog-carousel__button--left"><div><i class="icon-back"></i></div></div>',
    nextArrow: '<div class="catalog-carousel__button catalog-carousel__button--right"><div><i class="icon-next"></i></div></div>',
    infinite: true,
    dots: false,
    fade: true,
    cssEase: 'ease',
  });

  $('.js-nav-link').on('click', function(e){
      var elem = $(this).attr('href');

      if(elem.match(/#.+/)){
          scrollTo(elem);
          return;
      }
  });

  $('.toggle__button').on('click', function(){
    $('.toggle__button').removeClass('is-active');
    $(this).addClass('is-active');

    var currentFilter = parseInt($(this).data('filter'));

    $('#apartment-type').prop('selectedIndex', currentFilter).selectric('refresh');

  });

  $('.js-send-form').submit(function(e){
    var postData = $(this).serializeArray();
    var formURL = $(this).attr('action');
    var requiredFields = $(this).find('[data-required]');
    var isError = false;

    requiredFields.removeClass('is-error');

    requiredFields.each(function(){
      var self = $(this);

      if(!self.val()){
        self.addClass('is-error');
        isError = true;
      }
    });

    if(isError) return false;

    var form = $(this);

    $.ajax(
    {
        url: formURL,
        type: "POST",
        data: postData,
        success:function(data)
        {
          $.magnificPopup.close();

          setTimeout(function(){
            $.magnificPopup.open({
                items: {
                    src: $('#message-popup')
                },
                type: 'inline',
                fixedBgPos: true,
                closeBtnInside: true,
                preloader: false,
                midClick: true,
                removalDelay: 300,
                mainClass: 'my-mfp-slide-bottom',
                fixedContentPos: true,
                showCloseBtn: false
           });
          }, 300);
          
          form.find('input[type="text"], textarea').val('');
        },
        error:function()
        {
            $.magnificPopup.close();

            setTimeout(function(){
              $.magnificPopup.open({
                  items: {
                      src: $('#message-error')
                  },
                  type: 'inline',
                  fixedBgPos: true,
                  closeBtnInside: true,
                  preloader: false,
                  midClick: true,
                  removalDelay: 300,
                  mainClass: 'my-mfp-slide-bottom',
                  fixedContentPos: true,
                  showCloseBtn: false
             });
            }, 300);

        }
    });
    e.preventDefault();
  });

  // Magnific popups close event

  $('.js-close-button').on('click', function(){
      $.magnificPopup.close();
  });

  // Selectric init

  $('.select-box__control').selectric();

  var filterArea  = document.getElementById('filter-area'),
      filterPrice = document.getElementById('filter-price');

  // Filter area

  if(filterArea){
    noUiSlider.create(filterArea, {
      start: [ 0, 12000 ],
      step: 500,
      range: {
          'min': [  0 ],
          'max': [ 12000 ]
      }
    });

    filterArea.noUiSlider.on('update', function( values, handle ) {
      var filterAreaResult = document.getElementById('filter-area-result');

      filterAreaResult.innerHTML = parseInt(values[0]) + ' м<sup>2</sup> - ' + parseInt(values[1]) + ' м<sup>2</sup>';
    	$('input[name="filter-area-from"]').val(values[0]);
    	$('input[name="filter-area-to"]').val(values[1]);
    });
  }
  

  // Filter price

  if(filterPrice){
    noUiSlider.create(filterPrice, {
      start: [ 50000, 5000000 ],
      step: 5000,
      range: {
          'min': [  50000 ],
          'max': [ 5000000 ]
      }
    });

    filterPrice.noUiSlider.on('update', function( values, handle ) {
      var filterPriceResult = document.getElementById('filter-price-result');

      var start = values[0];
      var end = values[1];

      var startDelimetr,
          endDelimetr;

      if(parseInt(start) >= 100000){
          startDelimetr = 'млн.';
          start = (parseInt(start) / 1000000).toFixed(1).toString();
      }
      else{
         startDelimetr = 'т.';
         start = (parseInt(start) / 1000).toString(); 
      }

      if(parseInt(end) >= 100000){
          endDelimetr = 'млн.';
          end = (parseInt(end) / 1000000).toFixed(1).toString();
      }
      else{
         endDelimetr = 'т.';
         end = (parseInt(end) / 1000).toString(); 
      }


      start = start.replace('.', ',');
      end = end.replace('.', ',');

      start = start.replace(',0', '');
      end = end.replace(',0', '');

      $('input[name="filter-price-from"]').val(values[0]);
    	$('input[name="filter-price-to"]').val(values[1]);

      filterPriceResult.innerHTML =  start + ' ' + startDelimetr + ' - ' + end + ' ' + endDelimetr;
    });
  }

  function createMessage(settings){
    var startDelimetr,
        endDelimetr,
        start,
        end;

    if(parseInt(settings.start) >= 100000){
        startDelimetr = 'млн.';
        start = (parseInt(settings.start) / 1000000).toFixed(1).toString();
    }
    else{
       startDelimetr = 'т.';
       start = (parseInt(settings.start) / 1000).toString(); 
    }

    if(parseInt(settings.end) >= 100000){
        endDelimetr = 'млн.';
        end = (parseInt(settings.end) / 1000000).toFixed(1).toString();
    }
    else{
       endDelimetr = 'т.';
       end = (parseInt(settings.end) / 1000).toString(); 
    }

    start = start.replace('.', ',');
    end = end.replace('.', ',');

    start = start.replace(',0', '');
    end = end.replace(',0', '');


    return start + ' ' + startDelimetr + ' - ' + end + ' ' + endDelimetr;
  }


  var defaultPopupOptions = {
    type: 'inline',
    fixedBgPos: true,
    closeBtnInside: true,
    preloader: false,
    midClick: true,
    removalDelay: 300
  };

  $('.js-form-popup').magnificPopup($.extend(defaultPopupOptions,{
    fixedContentPos: true,
    showCloseBtn: false,
    callbacks: {
      open: function(){
        var mp = $.magnificPopup.instance;
        var button = $(mp.st.el);
        var _form = $(mp)[0].content;
        
        window.location.hash='#default-form';
      },
    },
    mainClass: 'my-mfp-slide-bottom'
  }));

  function changeImage(item, data){
    var lastImageIndex = item.data('lastImageIndex'),
        newImageIndex;

    if(lastImageIndex === undefined || lastImageIndex + 1 > data.images.length ){
      newImageIndex = 0;
    }
    else{
      newImageIndex = lastImageIndex;
    }

    item.css({'background': 'url(' + data.images[newImageIndex] + ') 50% 50% no-repeat'});

    newImageIndex++;
    item.data('lastImageIndex', newImageIndex);
  }

  var imageSlider;

  $('.apartments__col-inner').on('mouseover', function(e){
    var col     = $(this),
        colInfo = col.data('images');

    if(colInfo.images.length){
      imageSlider = setInterval(function(){
        changeImage(col, colInfo)
      }, 2000);
    }

  });

  $('.apartments__col-inner').on('mouseout', function(e){
    clearInterval(imageSlider);
  });

  function numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  tmpl.regexp = /([\s'\\])(?!(?:[^[]|\[(?!%))*%\])|(?:\[%(=|#)([\s\S]+?)%\])|(\[%)|(%\])/g;

  var limit = $('.js-more-apartments').data('limit');
  var offset = 9;

  $('.js-more-apartments').on('click', function(e){
    e.preventDefault();

    var self = $(this);

    $.get('/api/load/', { 'limit': limit, 'offset': offset }, function(data){

    	if(!data.length){
    		self.hide();
    		return;
    	}

    	for(var i = 0; i < data.length; i++){
    		data[i].meter = numberWithSpaces(data[i].meter);
    		data[i].price = numberWithSpaces(data[i].price);
    		$(tmpl("tmpl-catalog-col", data[i])).insertBefore('.apartments__button');
    	}

    	if(limit > -1){
    		offset = offset + limit
    	}
    	else{
    		self.hide();
    		return;
    	}
    	
    });

  });

  $('.js-search-form').submit(function(e){
    var formData = $(this).serializeArray();
    var formURL = $(this).attr('action');
    var formAction = $(this).attr('method');

    $.ajax(
    {
        url: formURL,
        type: formAction,
        data: formData,
        success:function(data)
        {
          var _container = $('.apartments__inner');

          if(data.length){
              _container.html('');
          }
          else{
          	_container.html('<p>Ничего не найдено. Попробуйте другой запрос.</p>');
          }

          for(var i = 0; i < data.length; i++) {
            data[i].meter = numberWithSpaces(data[i].meter);
        		data[i].price = numberWithSpaces(data[i].price);

        		_container.append($(tmpl("tmpl-catalog-col", data[i])));
      	  }

        },
        error:function()
        {
        	var _container = $('.apartments__inner');
        	_container.html('<p>Ошибка. Попробуйте позже.</p>');
        }
    });
    e.preventDefault();
  });

});