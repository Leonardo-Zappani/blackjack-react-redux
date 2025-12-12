# 🎰 Melhorias no Jogo de Blackjack

## 📋 Introdução

O Blackjack, também conhecido como “21”, é um dos jogos de cartas mais populares no mundo, amplamente difundido em cassinos físicos e plataformas de jogos digitais. Sua fama se deve à combinação equilibrada entre sorte, estratégia e tomada de decisão, tornando-o acessível a jogadores iniciantes e, ao mesmo tempo, desafiador para aqueles que buscam aprimorar suas habilidades. O objetivo principal do jogo é simples: somar cartas que totalizem o valor mais próximo possível de 21, sem ultrapassar esse limite, ao mesmo tempo em que se tenta superar a mão do dealer. Apesar de suas regras básicas serem relativamente fáceis de compreender, o Blackjack envolve diversas estratégias que influenciam diretamente o desempenho do jogador, o que contribui para sua relevância tanto como forma de entretenimento quanto como objeto de estudo em áreas como probabilidade, estatística e análise de risco.

## 📋 Regras do jogo

1. Valor das cartas
Cartas de 2 a 10: valem seu próprio número.
J, Q e K (cartas de figura): valem 10 pontos.
Ás (A): pode valer 1 ou 11 pontos, dependendo do que for mais vantajoso para o jogador.

2. Funcionamento inicial
Cada jogador recebe duas cartas.
O dealer também recebe duas cartas, sendo uma virada para cima e uma virada para baixo.
Os jogadores veem suas cartas e decidem como agir.

3. Ações possíveis do jogador
O jogador pode escolher entre várias opções:
Hit (Pedir carta): recebe uma carta adicional. Pode pedir quantas quiser, até parar ou ultrapassar 21.
Stand (Parar): mantém o valor atual da mão e encerra sua jogada.
Double Down (Dobrar): o jogador dobra sua aposta, recebe apenas uma carta e é obrigado a parar.
Split (Dividir): se as duas cartas iniciais forem iguais, o jogador pode dividi-las em duas mãos separadas, com apostas independentes.
Surrender (Render-se): em algumas variações, é possível desistir da mão inicial e recuperar metade da aposta.

4. Regras do dealer
Após todos os jogadores jogarem, o dealer revela sua carta virada para baixo.
Ele é obrigado a seguir regras fixas:
Deve comprar cartas até alcançar 17 pontos ou mais.
Se tiver entre 17 e 21, deve parar.
O dealer não pode tomar decisões estratégicas — segue sempre o mesmo padrão.

5. Condições de vitória
O jogador ganha quando:
Tem um valor maior que o do dealer, sem ultrapassar 21.
O dealer ultrapassa 21 (fica “estourado”).
Consegue um Blackjack (Ás + carta de valor 10) na mão inicial — normalmente paga mais que uma vitória comum.

O jogador perde quando:
Ultrapassa 21.
O dealer tem um valor maior, dentro do limite.

Se houver empate (push), ninguém ganha ou perde.


## 📋 O que foi feito

Este projeto de escola começou como um "jogo super quebrado" e foi transformado em uma experiência de blackjack completa e visualmente impressionante.

## 🎨 Principais melhorias implementadas

1 - Substituir fundo branco por um fundo verde estilizado (mesa de blackjack).
2 - Substituir o texto das cartas por imagens reais de cartas.
3 - Mostrar histórico da última mão
4 - Mostrar pontuação em destaque com cores (verde, vermelho, amarelo).
5 - Registrar resultados de partidas (vitórias/derrotas) em localStorage para exibição futura.
6 - Assegurar que o layout se adapte a diferentes resoluções e dispositivos móveis.
7 - Corrigir o bug onde o jogo pode travar se o usuário clicar repetidamente em "stick" após passar de 21.
8 - Melhorar tratamento do Ás, para que funcione corretamente como 1 ou 11 conforme a situação (ex. soft/hard).
9 - Organizar cartas em duas áreas distintas, simulando uma mesa real.

### **Visual de Cassino Profissional**
- Mesa verde texturizada simulando feltro real
- Bordas douradas com efeitos 3D
- Botões estilizados como fichas de cassino
- Animações suaves e efeitos hover

### **Cartas Visuais Realistas**
- Substituição de texto simples por emojis de cartas reais (🂡🂱🃁🃑)
- Carta virada representada por verso azul (🂠)
- Efeitos de sombra e profundidade
- Hover effects ao passar o mouse

### **Interface em Português**
- Todos os textos traduzidos
- Botões com ícones: 🎯 Deal, 🃏 Hit, ✋ Stand, 🚪 Quit
- Labels melhoradas: 🎰 Dealer, 👤 Sua Mão
- Mensagens de resultado em português

### **Layout Organizado**
- **Área do Dealer** (topo): cartas e pontuação do dealer
- **Controles Centrais** (meio): botões de ação e mensagens
- **Área do Jogador** (embaixo): suas cartas e pontuação
- **Histórico** (rodapé): últimas 25 partidas

### **Sistema de Pontuação Colorido**
- Verde: quando você está ganhando
- Vermelho: quando está perdendo
- Amarelo: empates (raros)
- Cores mudam automaticamente conforme o resultado

### **Histórico de 25 Jogadas**
- Salva automaticamente suas últimas 25 partidas
- Estatísticas em tempo real: vitórias, derrotas, taxa de sucesso
- Persistente: dados mantidos ao fechar e reabrir
- Botão para limpar histórico quando quiser

### **Funcionalidades Extras**
- Detecção de deck vazio com botão para reiniciar
- Botões desabilitados inteligentemente
- Indicação visual de quando o jogo terminou
- Responsivo para celular e tablet
- Correções de Bugs
- Melhora na documentação do projeto

## 🎯 Resultado Final

**Antes:** Jogo básico quebrado com interface simples
**Depois:** Experiência premium de blackjack com:

- ✅ Visual profissional de cassino
- ✅ 44 testes automatizados passando
- ✅ Histórico persistente de jogadas
- ✅ Interface intuitiva em português
- ✅ Compatível com todos os dispositivos
- ✅ Qualidade de aplicação profissional

## 🚀 Como jogar

1. Abra http://localhost:3000 no navegador
2. Clique em "🎯 Deal" para começar uma partida
3. Use "🃏 Hit" para pedir mais cartas ou "✋ Stand" para parar
4. Veja seu histórico crescer a cada partida
5. Tente alcançar a melhor taxa de vitórias!

**O jogo agora oferece uma experiência completa e divertida de blackjack!** 🎉