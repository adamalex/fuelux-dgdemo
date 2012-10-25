var FlickrDataSource = function (options) {
	this._formatter = options.formatter;
	this._columns = options.columns;
};

FlickrDataSource.prototype = {

	columns: function () {
		return this._columns;
	},

	data: function (options, callback) {
		var url = 'http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=d6d798f51bbd5ec0a1f9e9f1e62c43ab&format=json';
		var self = this;

		if (options.search) {

			url += '&tags=' + options.search;
			url += '&per_page=' + options.pageSize;
			url += '&page=' + (options.pageIndex + 1);

			$.ajax(url, {

				dataType: 'jsonp',
				jsonpCallback: 'jsonFlickrApi',
				jsonp: false,
				type: 'GET'

			}).done(function (response) {

				var data = response.photos.photo;
				var count = response.photos.total;
				var startIndex = (response.photos.page - 1) * response.photos.perpage;
				var endIndex = startIndex + response.photos.perpage;
				var end = (endIndex > count) ? count : endIndex;
				var pages = response.photos.pages;
				var page = response.photos.page;
				var start = startIndex + 1;

				if (self._formatter) self._formatter(data);

				callback({ data: data, start: start, end: end, count: count, pages: pages, page: page });

			});

		} else {

			callback({ data: [], start: 0, end: 0, count: 0, pages: 0, page: 0 });

		}
	}
};