//
// Controls navigation between pages
//

var O4 = O4 || {};

O4.NavigationController = function(options) {
	var _title = options.title,
		_stateID = 0,
		_states = {},
		_activeState;

	_rootView = options.rootView;
	_saveState(options.rootView);

	this.push = function(data) {
		data.sid = _saveState(data.view, data.handler);
		delete data.handler;

		console.log("=== push:", data.view, data.sid);

		history.pushState(data, null, data.url);
		this.setPageTitle(data.title);
		_activeState = data.view;
	};

	this.setPageTitle = function	(title) {
		document.title = _title + (title ? " - " + title : "");
		window['_gaq'] && _gaq.push(['_trackPageview']);
		window['_gs'] && _gs("track", document.location.pathname, document.title);
	};

	function _saveState(name, handler) {
		if (!_getState(name)) {
			_states[name] = {
				sid: _stateID++,
				handler: handler
			};
		}

		return _stateID - 1;
	}

	function _getState(name) {
		return _states[name];
	}

	function _handleHistoryPop(e) {
		var state = e.state;
		if (!state) {
			state = _getState(_rootView);
			state.view = _rootView;
		}

		console.log("=== pop:", state.view,state.sid,_activeState);

		var activeStateData = _getState(_activeState);

		if (state.sid > activeStateData.sid) {
			_getState(state.view).handler.handlePush(state.view, true);
		} else {
			activeStateData.handler.handlePop(state.view, true);
		}

		_activeState = state.view;
	}

	window.addEventListener("popstate", _handleHistoryPop, false);
};