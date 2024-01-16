/* eslint-disable no-unused-vars */
export const calculateRating = (auctions) => {
  let count = 0;
  let sum = 0;
  auctions?.forEach((auct) => {
    if (auct.reviews[0]?.rating) {
      count++;
      sum += Number(auct.reviews[0].rating);
    }
  });
  const averageRating = count > 0 ? (sum / count).toFixed(2) : 0;
  return averageRating + `/5 from ${count} reviews`;
};

export const compareDates = (startDateString, endDateString, status, auct) => {
  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);
  const currentDate = new Date();
  if (currentDate < startDate && status.includes(1)) {
    return auct;
  } else if (
    startDate <= currentDate &&
    currentDate <= endDate &&
    status.includes(0)
  ) {
    return auct;
  } else if (currentDate > endDate && status.includes(-1)) {
    return auct;
  }
};

export const compareDatesandReturn = (
  auctions,
  setExpiredEnglish,
  setLiveEnglish,
  setUpcomingEnglish,
  setExpiredReverse,
  setLiveReverse,
  setUpcomingReverse
) => {
  let ee = [],
    le = [],
    ue = [],
    er = [],
    lr = [],
    ur = [];
  auctions.map((auct) => {
    const startDate = new Date(auct.startsOn);
    const endDate = new Date(auct.endsOn);
    const currentDate = new Date();
    if (currentDate < startDate) {
      auct.english ? ue.push(auct) : ur.push(auct);
    } else if (startDate <= currentDate && currentDate <= endDate) {
      auct.english ? le.push(auct) : lr.push(auct);
    } else if (currentDate > endDate) {
      auct.english ? ee.push(auct) : er.push(auct);
    }
  });
  setExpiredEnglish(ee);
  setLiveEnglish(le);
  setUpcomingEnglish(ue);
  setExpiredReverse(er);
  setLiveReverse(lr);
  setUpcomingReverse(ur);
};

// ...

const calculateAverageRating = (reviews) => {
  if (reviews.length === 0) {
    return 0;
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  console.log("rating", totalRating / reviews.length);
  return totalRating / reviews.length;
};

const sortAuctionsLowToHigh = (auctions) => {
  // Ensure auctions is an array and has at least one item
  if (!Array.isArray(auctions) || auctions.length === 0) {
    return auctions;
  }

  return auctions.sort((a, b) => {
    // Ensure reviews is an array and has at least one item
    const reviewsA = a.reviews || [];
    const reviewsB = b.reviews || [];

    const ratingA = calculateAverageRating(reviewsA);
    const ratingB = calculateAverageRating(reviewsB);
    return ratingA - ratingB;
  });
};

const sortAuctionsHighToLow = (auctions) => {
  // Ensure auctions is an array and has at least one item
  if (!Array.isArray(auctions) || auctions.length === 0) {
    return auctions;
  }

  return auctions.sort((a, b) => {
    // Ensure reviews is an array and has at least one item
    const reviewsA = a.reviews || [];
    const reviewsB = b.reviews || [];

    const ratingA = calculateAverageRating(reviewsA);
    const ratingB = calculateAverageRating(reviewsB);
    return ratingB - ratingA;
  });
};

export const sortUsersLowToHigh = (users) => {
  if (!Array.isArray(users) || users.length === 0) {
    return users;
  }

  return users
    .map((user) => {
      const auctions = user.auctions || [];
      const sortedAuctions = sortAuctionsLowToHigh(auctions);
      const rating = calculateAverageRating(sortedAuctions[0]?.reviews || []);
      console.log(auctions, sortedAuctions, rating);

      return {
        ...user,
        auctions: sortedAuctions,
        rating: rating,
      };
    })
    .sort((userA, userB) => userA.rating - userB.rating);
};

export const sortUsersHighToLow = (users) => {
  if (!Array.isArray(users) || users.length === 0) {
    return users;
  }

  return users
    .map((user) => {
      const auctions = user.auctions || [];
      const sortedAuctions = sortAuctionsHighToLow(auctions);
      const rating = calculateAverageRating(sortedAuctions[0]?.reviews || []);

      // Create a new user object with sorted auctions
      return {
        ...user,
        auctions: sortedAuctions,
        rating: rating,
      };
    })
    .sort((userA, userB) => userB.rating - userA.rating);
};
