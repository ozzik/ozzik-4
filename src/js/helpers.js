var _ = {
    url: function(str) {
        return _BASE_URL + str;
    },

    data_url: function(str) {
        return _.url("data/" + str);
    }
}