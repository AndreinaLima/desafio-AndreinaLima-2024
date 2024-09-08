class RecintosZoo {
  constructor() {
    this.recintos = [
      {
        numero: 1,
        bioma: ["savana"],
        tamanho: 10,
        animais: [{ especie: "MACACO", quantidade: 3 }],
      },
      { numero: 2, bioma: ["floresta"], tamanho: 5, animais: [] },
      {
        numero: 3,
        bioma: ["savana", "rio"],
        tamanho: 7,
        animais: [{ especie: "GAZELA", quantidade: 1 }],
      },
      { numero: 4, bioma: ["rio"], tamanho: 8, animais: [] },
      {
        numero: 5,
        bioma: ["savana"],
        tamanho: 9,
        animais: [{ especie: "LEAO", quantidade: 1 }],
      },
    ]

    this.animais = {
      LEAO: { tamanho: 3, bioma: ["savana"], carnivoro: true },
      LEOPARDO: { tamanho: 2, bioma: ["savana"], carnivoro: true },
      CROCODILO: { tamanho: 3, bioma: ["rio"], carnivoro: true },
      MACACO: { tamanho: 1, bioma: ["savana", "floresta"], carnivoro: false },
      GAZELA: { tamanho: 2, bioma: ["savana"], carnivoro: false },
      HIPOPOTAMO: { tamanho: 4, bioma: ["savana", "rio"], carnivoro: false },
    }
  }

 analisaRecintos(animal, quantidade) {
  // Verifica se a espécie é válida
  if (!this.animais[animal]) {
    return { erro: "Animal inválido" };
  }

  // Verifica se a quantidade é válida
  if (quantidade <= 0) {
    return { erro: "Quantidade inválida" };
  }

  // Função para calcular o espaço livre em um recinto
  const calcularEspacoLivre = (recinto, animal, quantidade) => {
    const espacoOcupado = this.calcularEspacoOcupado(
      recinto,
      animal,
      quantidade
    );
    return recinto.tamanho - espacoOcupado;
  };

  // Filtra e formata os recintos viáveis
  const recintosViaveis = this.recintos
    .filter((recinto) => this.verificaRecinto(recinto, animal, quantidade))
    .map((recinto) => {
      const espacoLivre = calcularEspacoLivre(recinto, animal, quantidade);
      return {
        numero: recinto.numero,
        espacoLivre,
        tamanhoTotal: recinto.tamanho,
      };
    })
    .sort((a, b) => a.numero - b.numero); // Ordena pelo número do recinto

  // Verifica se há recintos viáveis e retorna o resultado
  if (recintosViaveis.length === 0) {
    return { erro: "Não há recinto viável" };
  }

  // Formata a resposta para incluir o espaço livre e o tamanho total
  const resposta = recintosViaveis.map(
    ({ numero, espacoLivre, tamanhoTotal }) =>
      `Recinto ${numero} (espaço livre: ${espacoLivre} total: ${tamanhoTotal})`
  );

  return { recintosViaveis: resposta };
}


  verificaRecinto(recinto, especie, quantidade) {
    const animal = this.animais[especie]

    const espacoOcupado = this.calcularEspacoOcupado(
      recinto,
      especie,
      quantidade
    )

    if (espacoOcupado > recinto.tamanho) return false

    if (!animal.bioma.some((b) => recinto.bioma.includes(b))) return false

    if (
      animal.carnivoro &&
      recinto.animais.length > 0 &&
      recinto.animais[0].especie !== especie
    )
      return false
    if (
      recinto.animais.some((a) => this.animais[a.especie].carnivoro) &&
      especie !== recinto.animais[0].especie
    )
      return false

    if (
      especie === "HIPOPOTAMO" &&
      recinto.animais.length === 0 &&
      !recinto.bioma.includes("savana") &&
      !recinto.bioma.includes("rio")
    )
      return false

    if (
      especie === "MACACO" &&
      recinto.animais.length === 0 &&
      quantidade === 1
    )
      return false

    return true
  }

  calcularEspacoOcupado(recinto, novaEspecie, novaQuantidade) {
    const espacoOcupadoAtual = this.calcularEspacoAtualOcupado(recinto)
    const espacoOcupadoNovo = this.calcularEspacoNovoOcupado(
      novaEspecie,
      novaQuantidade
    )

    const espacoAdicional = this.calcularEspacoAdicional(recinto, novaEspecie)

    return espacoOcupadoAtual + espacoOcupadoNovo + espacoAdicional
  }

  // Calcula o espaço atualmente ocupado pelos animais no recinto
  calcularEspacoAtualOcupado(recinto) {
    return recinto.animais.reduce(
      (acc, animal) =>
        acc + this.animais[animal.especie].tamanho * animal.quantidade,
      0
    )
  }

  // Calcula o espaço ocupado pelos novos animais que serão adicionados
  calcularEspacoNovoOcupado(novaEspecie, novaQuantidade) {
    return this.animais[novaEspecie].tamanho * novaQuantidade
  }

  // Calcula o espaço adicional que pode ser necessário se os animais atuais forem de espécie diferente
  calcularEspacoAdicional(recinto, novaEspecie) {
    if (
      recinto.animais.length > 0 &&
      recinto.animais[0].especie !== novaEspecie
    ) {
      return 1
    }
    return 0
  }
}

export { RecintosZoo as RecintosZoo }
