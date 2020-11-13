/*searching for keywords*/
function SearchButton(){
	console.log("called");
	var test_db = require('./test_db');
	var SearchInput = document.getElementById('search-input').value.toLowerCase();
	console.log("== Search",SearchInput);
	
	if(SearchInput != ""){
		for(var i = 0; i < test_db.length; i++){
			
			var Text = test_db[i].children[0].children[1].textContent.toLowerCase();
			
			if(!Text.includes(SearchInput)){
				test_db[i].classList.add('hidden');
			}
			
			if(Text.includes(SearchInput)){
				test_db[i].classList.remove('hidden');
			}
		}		
	} else{
		for(var i = 0; i < ExpertKeywords.length; i++){
				test_db[i].classList.remove('hidden');
		}
	}
}

window.addEventListener('DOMContentLoaded', function () {

  var searchButton = document.getElementById('search-button');
  if (searchButton) {
    searchButton.addEventListener('click', SearchButton);
  }

  var searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', SearchButton);
  }

});
