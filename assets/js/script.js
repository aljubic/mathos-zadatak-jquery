$(document).ready(function() {
	var API="http://193.246.33.24/data/"
	var users = $("#users");
	
	$.get(API, {user:1}, function(data) {
		$.each(data, function(i, usr) {
		addUser(usr);
		});
	});
	
	function addUser(usr) {
		users.append("<tr data-id=" + usr.id + "><td>"+ usr.name + "</td><td>" + usr.surname + "</td><td><button class='btn btn-warning edit'>Edit</button><button class='btn btn-danger delete'>Delete</button></td></tr>");
	};
	
	
	var dialog = $( "#dialog" ).dialog({
		autoOpen : false,
		modal : true,
		buttons:{
			"Dodaj novog" : function() {
				form.submit();
			},
			Cancel: function() {
				dialog.dialog("close")
			}
		},
		close: function() {
			form[0].reset();
		}
	});
	
	
	$("#addNew").on("click", function() {
		dialog.dialog("open");
	});
	
	var form = dialog.find("form");
	
	form.on("submit", function(e) {
		e.preventDefault();
		
		$.post(API + "create", form.serialize()).done(function(data) {
			addUser(data);
			dialog.dialog("close");
		}).fail(function(error) {
			console.log(error.responseText);
		});
		
	});
	
	users.on("click", ".delete", function() {
		var row = $(this).closest("tr");
		
		$.post(API + "destroy/" + row.data("id"), {}, function(data) {
			row.fadeOut(function() {
				$(this).remove();
			});
		});
		
	});
	
	users.on("click", ".edit", function() {
		var row = $(this).closest("tr");
		
		var ime = row.find('td:nth-child(1)').text();
		row.find('td:nth-child(1)').html("<input type='text' name='name' value=" + ime + ">");
		
		var input = row.find('td:nth-child(1) input');
		tmp = input.val(); 
		input.focus().val("").blur().focus().val(tmp);
		
		var prezime = row.find('td:nth-child(2)').text();
		row.find('td:nth-child(2)').html("<input type='text' name='surname' value=" + prezime + ">");
		
		row.find('td:nth-child(3)').html("<button class='btn btn-success save'>Submit</button>");
		
	});
	
	users.on("click", ".save", function() {
		var row = $(this).closest("tr");
		var novoIme = row.find('td:nth-child(1) input').val();
		var novoPrezime = row.find('td:nth-child(2) input').val();
		
		$.post(API + "update/" + row.data("id") + "/?name=" + novoIme + "&surname=" + novoPrezime, {}, function(usr) {
			row.html("<td>"+ usr.name + "</td><td>" + usr.surname + "</td><td><button class='btn btn-warning edit'>Edit</button><button class='btn btn-danger delete'>Delete</button></td>");
		});
		
	});
	
	
});