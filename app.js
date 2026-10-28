//1. Dependências e Middlewares
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//3. Definição de Rotas 
const routeUsuario= require('./router/routeUsuario')
const routeCategoria = require('./router/routeCategoria');
const routeCliente = require('./router/routeCliente');
const routeEntrada = require('./router/routeEntrada');
const routeEstoque = require('./router/routeEstoque');
const routeFornecedor = require('./router/routeFornecedor');
const routeFuncionario = require('./router/routeFuncionario');
const routeHistoricoPrecos = require('./router/routeHistoricoPrecos');
const routeLog = require('./router/routeLog');
const routeMovimentacao = require('./router/routeMovimentacao');
const routePedido = require('./router/routePedido');
const routePedidoItem = require('./router/routePedidoItem');
const routeProduto = require('./router/routeProduto');
const routeSaida = require('./router/routeSaida');
//2. Controle de CORS (Headers & OPTIONS)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));



app.use("/usuario",routeUsuario);
app.use('/categoria', routeCategoria);
app.use('/cliente', routeCliente);
app.use('/entrada', routeEntrada);
app.use('/estoque', routeEstoque);
app.use('/fornecedor', routeFornecedor);
app.use('/funcionario', routeFuncionario);
app.use('/historico-precos', routeHistoricoPrecos);
app.use('/log', routeLog);
app.use('/movimentacao', routeMovimentacao);
app.use('/pedido', routePedido);
app.use('/pedido-item', routePedidoItem);
app.use('/produto', routeProduto);
app.use('/saida', routeSaida);

//4. Tratamento de Erros (Fallback & Handler)
app.use((req,res,next)=>{
      const erro = new Error("Não encontrado!");
      erro.status = 404;
      next(erro);
});
app.use((error,req,res,next)=>{
        res.status(error.status || 500);
        return res.json({
            erro:{
                 mensagem:error.message
            }  })
})

module.exports = app
