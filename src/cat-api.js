const apiKey =
  'live_QMAtmTQkiGazrxebG23AS3wtLILf4Zqg5dX2f7pphHKbPeLUhSV5yTLIfmU4s3pe';

export async function fetchBreeds() {
  try {
    const response = await fetch('https://api.thecatapi.com/v1/breeds', {
      headers: {
        'x-api-key': apiKey,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch breeds');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function fetchCatByBreed(breedId) {
  try {
    const response = await fetch(
      `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`,
      {
        headers: {
          'x-api-key': apiKey,
        },
      }
    );
    if (!response.ok) {
      throw new Error('Failed to fetch cat');
    }
    const data = await response.json();
    return data[0];
  } catch (error) {
    throw new Error(error.message);
  }
}
