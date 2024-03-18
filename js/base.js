function salvarToken(token){
    localStorage.setItem('token', token);
}

function obterToken(token){
    return localStorage.getItem('token');
}

function salvarUsuario(usuario){
    return localStorage.setItem('usuario', JSON.stringify(usuario));
}

function obterUsuario(usuario){
    let usuarioStorage = localStorage.getItem('usuario', JSON.stringify(usuario));
    return JSON.parse(usuarioStorage);
}

function sairDoSistema(){
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.open('login.html', '_self');
}

function usuarioLogado(){
    let token = obterToken()
    return !!token;
}

function validarUsuarioAutentica(){
    let logado = usuarioLogado();
    if(window.location.pathname == '/login.html'){
        if(logado)
            window.open('controle-produtos.html', '_self')
    } else {
        if(!logado)
            window.open('login.html', '_self')
    }
}

validarUsuarioAutentica()