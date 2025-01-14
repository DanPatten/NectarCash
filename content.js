// Function to convert points to dollars and display both
function convertPointsToDollars() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;

  while ((node = walker.nextNode())) {
    const parent = node.parentNode;

    // Skip text nodes inside elements already processed
    if (parent && parent.classList && parent.classList.contains("processed-for-dollars")) {
      continue;
    }

    const pointsRegex = /\b(\d{1,3}(?:,\d{3})*|\d+)\s*points?\b/gi;

    // Replace points with their dollar equivalent and show both
    const updatedText = node.nodeValue.replace(pointsRegex, (match, points) => {
      const cleanPoints = points.replace(/,/g, ''); // Remove commas if present
      const parsedPoints = parseInt(cleanPoints, 10); // Convert to a valid number
      const dollars = (parsedPoints * 0.1).toFixed(2);
      return `$${dollars} (${parsedPoints} points)`;
    });

    // Only update the node if the text has changed
    if (updatedText !== node.nodeValue) {
      node.nodeValue = updatedText;
      if (parent && parent.classList) {
        parent.classList.add("processed-for-dollars");
      }
    }
  }
}

// Function to add the dollar equivalent below "Available Points to Redeem"
function addDollarAmountForAvailablePoints() {
  const pointsElement = Array.from(document.querySelectorAll('p')).find(
    (el) => el.textContent.trim() === "Available Points to Redeem"
  );

  if (pointsElement) {
    const parentDiv = pointsElement.parentElement;
    const pointsValueElement = parentDiv.querySelector('p.coreText--display-lg');

    if (pointsValueElement && !parentDiv.querySelector('.dollar-amount')) {
      const points = parseInt(pointsValueElement.textContent.trim(), 10) || 0;
      const dollars = (points * 0.1).toFixed(2);

      const dollarElement = document.createElement('p');
      dollarElement.textContent = `$${dollars} (Equivalent)`;
      dollarElement.style.color = 'rgb(255, 255, 255)';
      dollarElement.className = 'coreText coreText--text-md coreText--medium dollar-amount';

      // Insert the dollar amount below the "Available Points to Redeem" text
      parentDiv.insertBefore(dollarElement, pointsElement.nextSibling);
    }
  }
}

// Use MutationObserver to detect dynamic content
function observeDomChanges() {
  const observer = new MutationObserver(() => {
    convertPointsToDollars();
    addDollarAmountForAvailablePoints();
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// Polling mechanism for initial content load
function startPolling() {
  const interval = setInterval(() => {
    if (document.body) {
      convertPointsToDollars();
      addDollarAmountForAvailablePoints();
      clearInterval(interval); // Stop polling once the content is found
      observeDomChanges(); // Start observing for future changes
    }
  }, 500); // Check every 500ms
}

// Start the script
startPolling();
