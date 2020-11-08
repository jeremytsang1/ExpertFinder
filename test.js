
    console.log("fc")
    let new_user = [];
    // example {id:1592304983049, title: 'Deadpool', year: 2015}
    const addMovie = (ev)=>{
        ev.preventDefault();  //to stop the form submitting
  //      let movie = {
    //        id: Date.now(),
      //      title: document.getElementById('title').value,
      //      year: document.getElementById('yr').value
       // }

        let user = {
            Id: Date.now(),
            Name: document.getElementById('profile-creation-first-name').value,
            TechSkills: document.getElementById('profile-creation-skills').value
            Coursework: document.getElementById('profile-creation-courses').value
            Industry: document.getElementById('profile-creation-industry').value
            // ContactInfo:


        }

        new_user.push(user);
        document.forms[0].reset(); // to clear the form for the next entries
        //document.querySelector('form').reset();

        //for display purposes only
        console.warn('added' , {new_user} );
        let pre = document.querySelector('#msg pre');
        pre.textContent = '\n' + JSON.stringify(new_user, '\t', 2);

        //saving to localStorage
        localStorage.setItem('MyMovieList', JSON.stringify(new_user) );
    }

    document.addEventListener('DOMContentLoaded', ()=>{
        document.getElementById('register').addEventListener('click', addMovie);
    });
