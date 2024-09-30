import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';
import Chart from './components/Chart';
import Web3Component from './components/Web3Component';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Web3Component/>
      <div className='title'><h1>BTC/USDT CHART</h1></div>
      <Chart/>
    </QueryClientProvider>
  );
}

export default App;
