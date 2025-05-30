// Verificação de ambiente permitido
const allowedHosts = ['github.io', '127.0.0.1', 'localhost'];
const isAllowedHost = allowedHosts.some(host => window.location.hostname.endsWith(host));

if (!isAllowedHost) {
    console.error('Acesso não autorizado');
    document.body.innerHTML = '<h1>Acesso não permitido</h1>';
    throw new Error('Host não autorizado');
}

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyB3F5mSrXaTrDaUh91Hts1POhzicTM3fEE",
    authDomain: "vistoria-gzl.firebaseapp.com",
    projectId: "vistoria-gzl",
    storageBucket: "vistoria-gzl.firebasestorage.app",
    messagingSenderId: "836217547017",
    appId: "1:836217547017:web:746702cb55c0ae9dc98bd8",
    measurementId: "G-0PB7B2Q541",
    databaseURL: "https://vistoria-gzl-default-rtdb.firebaseio.com/"
};

// Inicializa o Firebase apenas uma vez
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const database = firebase.database();
const auth = firebase.auth();

// Autenticação anônima
auth.signInAnonymously()
    .then(() => {
        console.log("Autenticado anonimamente");
    })
    .catch((error) => {
        console.error("Erro na autenticação anônima:", error);
    });

// Restante do seu código permanece igual...
document.getElementById('vistoriaForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const unidade = document.getElementById('unidade').value;
    const numeroDT = document.getElementById('numeroDT').value;
    const timestamp = new Date().toISOString();
    
    const vistoriasRef = database.ref('vistorias');
    
    const novaVistoria = {
        unidade: unidade,
        numeroDT: numeroDT,
        timestamp: timestamp
    };
    
    vistoriasRef.push(novaVistoria)
        .then(() => {
            document.getElementById('message').textContent = "Dados salvos com sucesso!";
            document.getElementById('vistoriaForm').reset();
            
            setTimeout(() => {
                document.getElementById('message').textContent = "";
            }, 3000);
        })
        .catch((error) => {
            document.getElementById('message').textContent = "Erro ao salvar: " + error.message;
        });
});

document.getElementById('numeroDT').addEventListener('input', function(e) {
    this.value = this.value.replace(/[^0-9]/g, '');
});