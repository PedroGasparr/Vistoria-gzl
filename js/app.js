 // Firebase configuration
        const firebaseConfig = {
            apiKey: "AIzaSyB3F5mSrXaTrDaUh91Hts1POhzicTM3fEE",
            authDomain: "vistoria-gzl.firebaseapp.com",
            projectId: "vistoria-gzl",
            storageBucket: "vistoria-gzl.appspot.com",
            messagingSenderId: "836217547017",
            appId: "1:836217547017:web:746702cb55c0ae9dc98bd8",
            measurementId: "G-0PB7B2Q541",
            databaseURL: "https://vistoria-gzl-default-rtdb.firebaseio.com/"
        };

        // Initialize Firebase
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }

        const database = firebase.database();
        const auth = firebase.auth();

        // Anonymous authentication
        auth.signInAnonymously()
            .then(() => {
                console.log("Autenticado anonimamente");
            })
            .catch((error) => {
                console.error("Erro na autenticação anônima:", error);
            });

        // Form submission
        document.getElementById('vistoriaForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const unidade = document.getElementById('unidade').value;
            const numeroDT = document.getElementById('numeroDT').value;
            const timestamp = new Date().toISOString();
            const carro = document.getElementById('carro').value;
            const travessas = document.getElementById('travessas').value;
            const numero = document.getElementById('numero').value;
            const possuiGuidao = document.getElementById('possuiGuidao').value;
            const linhaVida = document.getElementById('linhaVida').value;
            
            const vistoriasRef = database.ref('vistorias');
            
            const novaVistoria = {
                unidade: unidade,
                numeroDT: numeroDT,
                carro: carro,
                Guilhotina: travessas,
                numeroGuidoes: travessas === 'Sim' ? numero : null,
                possuiGuidao: travessas === 'Não' ? possuiGuidao : null,
                linhaVida: linhaVida,
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

        // Tab functionality
        function openTab(evt, tabName) {
            var i, tabcontent, tablinks;
            
            tabcontent = document.getElementsByClassName("tabcontent");
            for (i = 0; i < tabcontent.length; i++) {
                tabcontent[i].style.display = "none";
            }
            
            tablinks = document.getElementsByClassName("tablinks");
            for (i = 0; i < tablinks.length; i++) {
                tablinks[i].className = tablinks[i].className.replace(" active", "");
            }
            
            document.getElementById(tabName).style.display = "block";
            evt.currentTarget.className += " active";
        }
        
        // Search functionality
        function searchDT() {
            const dtNumber = document.getElementById('searchDT').value.trim();
            if (!dtNumber) {
                alert("Por favor, digite um número de DT para buscar");
                return;
            }
            
            const searchResults = document.getElementById('searchResults');
            searchResults.innerHTML = "<p>Buscando...</p>";
            
            const vistoriasRef = firebase.database().ref('vistorias');
            vistoriasRef.orderByChild('numeroDT').equalTo(dtNumber).once('value')
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        let resultsHTML = "";
                        snapshot.forEach((childSnapshot) => {
                            const data = childSnapshot.val();
                            resultsHTML += `
                                <div class="result-item">
                                    <p><strong>DT:</strong> ${data.numeroDT}</p>
                                    <p><strong>Unidade:</strong> ${data.unidade.replace(/_/g, ' ')}</p>
                                    <p><strong>Tipo de Veículo:</strong> ${data.carro}</p>
                                    <p><strong>Tipo Guilhotina:</strong> ${data.travessas}</p>
                                    ${data.travessas === 'Sim' ? `<p><strong>Nº Guidões:</strong> ${data.numeroGuidoes}</p>` : ''}
                                    ${data.travessas === 'Não' ? `<p><strong>Possui Guidão:</strong> ${data.possuiGuidao}</p>` : ''}
                                    <p><strong>Linha de Vida:</strong> ${data.linhaVida}</p>
                                    <p><strong>Data/Hora:</strong> ${new Date(data.timestamp).toLocaleString()}</p>
                                </div>
                            `;
                        });
                        searchResults.innerHTML = resultsHTML;
                    } else {
                        searchResults.innerHTML = `<p>Nenhum registro encontrado para a DT ${dtNumber}</p>`;
                    }
                })
                .catch((error) => {
                    searchResults.innerHTML = `<p>Erro na busca: ${error.message}</p>`;
                });
        }
        
        // Field toggling functions
        // Modifique a função que controla o tipo de veículo
        function toggleTravessasField() {
            const carroSelect = document.getElementById('carro').value;
            const travessasGroup = document.getElementById('travessasGroup');
            const linhaVidaGroup = document.getElementById('linhaVidaGroup');
            const numeroGroup = document.getElementById('numeroGroup');
            const possuiGuidaoGroup = document.getElementById('possuiGuidaoGroup');

            // Reseta todos os campos relacionados
            document.getElementById('travessas').selectedIndex = 0;
            document.getElementById('numero').selectedIndex = 0;
            document.getElementById('possuiGuidao').selectedIndex = 0;
            
            // Mostra/esconde os grupos instantaneamente
            if (carroSelect === 'Sider') {
                travessasGroup.style.display = 'block';
                linhaVidaGroup.style.display = 'block';
            } else {
                travessasGroup.style.display = 'none';
                numeroGroup.style.display = 'none';
                possuiGuidaoGroup.style.display = 'none';
                linhaVidaGroup.style.display = 'none';
            }
        }

        // Adicione um event listener para mudanças no campo carro
        document.getElementById('carro').addEventListener('change', function() {
            toggleTravessasField(); // Atualiza imediatamente ao mudar
        });

        function toggleGuidaoFields() {
            const isGuilhotina = document.getElementById('travessas').value;
            const numeroGroup = document.getElementById('numeroGroup');
            const possuiGuidaoGroup = document.getElementById('possuiGuidaoGroup');
            
            numeroGroup.style.display = 'none';
            possuiGuidaoGroup.style.display = 'none';
            
            if (isGuilhotina === 'Sim') {
                numeroGroup.style.display = 'block';
            } else if (isGuilhotina === 'Não') {
                possuiGuidaoGroup.style.display = 'block';
            }
        }

        // Input validation
        document.getElementById('numeroDT').addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '');
        });

        document.getElementById('searchDT').addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '');
        });

        // Initialize fields
        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('travessasGroup').style.display = 'none';
            document.getElementById('numeroGroup').style.display = 'none';
            document.getElementById('possuiGuidaoGroup').style.display = 'none';
            document.getElementById('linhaVidaGroup').style.display = 'none';
        });