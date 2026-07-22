function buildDestinationSuggestions(entries) {
  const destinations = entries
    .map(entry => entry.destination)
    .filter(Boolean)
    .reduce((accumulator, destination) => {
      if (!accumulator.includes(destination)) {
        accumulator.push(destination);
      }
      return accumulator;
    }, []);

  return destinations;
}

export { buildDestinationSuggestions };
