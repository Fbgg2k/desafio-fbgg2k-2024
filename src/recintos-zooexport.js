import promptSync from 'prompt-sync';

const prompt = promptSync();

class RecintosZoo {
  constructor() {
    this.recintos = [
      { numero: 1, bioma: 'savana', tamanhoTotal: 10, animais: [{ especie: 4, quantidade: 3 }] },
      { numero: 2, bioma: 'floresta', tamanhoTotal: 5, animais: [] },
      { numero: 3, bioma: 'savana e rio', tamanhoTotal: 7, animais: [{ especie: 5, quantidade: 1 }] },
      { numero: 4, bioma: 'rio', tamanhoTotal: 8, animais: [] },
      { numero: 5, bioma: 'savana', tamanhoTotal: 9, animais: [{ especie: 1, quantidade: 1 }] }
    ];

    this.animais = {
      1: { especie: 'LEAO', tamanho: 3, biomas: ['savana'] },
      2: { especie: 'LEOPARDO', tamanho: 2, biomas: ['savana'] },
      3: { especie: 'CROCODILO', tamanho: 3, biomas: ['rio'] },
      4: { especie: 'MACACO', tamanho: 1, biomas: ['savana', 'floresta'] },
      5: { especie: 'GAZELA', tamanho: 2, biomas: ['savana'] },
      6: { especie: 'HIPOPOTAMO', tamanho: 4, biomas: ['savana', 'rio'] }
    };
  }

  analisaRecintos(especieNumero, quantidade) {
    const animal = this.animais[especieNumero];
    if (!animal) {
      return { erro: "Animal inválido" };
    }

    if (typeof quantidade !== 'number' || quantidade <= 0) {
      return { erro: "Quantidade inválida" };
    }

    const recintosViaveis = [];

    for (const recinto of this.recintos) {
      const espacoOcupado = recinto.animais.reduce((total, a) => {
        const animalRecinto = this.animais[a.especie];
        return animalRecinto ? total + a.quantidade * animalRecinto.tamanho : total;
      }, 0);
      
      const espacoLivre = recinto.tamanhoTotal - espacoOcupado;

      if (animal.biomas.includes(recinto.bioma) && espacoLivre >= quantidade * animal.tamanho) {
        if (this.verificaConforto(recinto, especieNumero, quantidade)) {
          recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoLivre - quantidade * animal.tamanho} total: ${recinto.tamanhoTotal})`);
        }
      }
    }

    if (recintosViaveis.length === 0) {
      return { erro: "Não há recinto viável" };
    }

    return { recintosViaveis };
  }

  verificaConforto(recinto, especieNumero, quantidade) {
    const especie = this.animais[especieNumero].especie;
    const carnivoros = ['LEAO', 'LEOPARDO', 'CROCODILO'];
    const herbivoros = ['GAZELA', 'HIPOPOTAMO'];
    const macacos = ['MACACO'];
  
    if (!this.animais[especieNumero]) {
      throw new Error(`Espécie ${especie} não encontrada!`);
    }
  
    if (carnivoros.includes(especie)) {
      return recinto.animais.every(a => this.animais[a.especie]?.especie === especie);
    }
  
    if (especie === 'HIPOPOTAMO' && recinto.bioma !== 'savana e rio') {
      return false;
    }
  
    if (macacos.includes(especie)) {
      if (recinto.animais.length === 0) {
        return false;
      }
      if (
        recinto.animais.length === 1 &&
        this.animais[recinto.animais[0].especie]?.especie === 'MACACO' &&
        recinto.animais[0].quantidade === 1
      ) {
        return false;
      }
    }
  
    if (recinto.animais.length > 0 && !recinto.animais.every(a => this.animais[a.especie]?.especie === especie)) {
      return (
        recinto.tamanhoTotal - 
        recinto.animais.reduce(
          (total, a) => total + a.quantidade * (this.animais[a.especie]?.tamanho || 0),
          0
        ) >= quantidade * this.animais[especieNumero].tamanho + 1
      );
    }
  
    return (
      recinto.tamanhoTotal - 
      recinto.animais.reduce(
        (total, a) => total + a.quantidade * (this.animais[a.especie]?.tamanho || 0),
        0
      ) >= quantidade * this.animais[especieNumero].tamanho
    );
  }
}

// Exportar a classe conforme o requisito para os testes automáticos
export { RecintosZoo as RecintosZoo };
