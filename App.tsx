import React, { useState, useEffect } from "react";
import { Play, Download, BarChart3, Clock } from "lucide-react";

const SortingComparison = () => {
  const [results, setResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState("");

  // Sorting Algorithm Implementations
  const bubbleSort = (arr) => {
    const n = arr.length;
    const sortedArr = [...arr];
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (sortedArr[j] > sortedArr[j + 1]) {
          [sortedArr[j], sortedArr[j + 1]] = [sortedArr[j + 1], sortedArr[j]];
        }
      }
    }
    return sortedArr;
  };

  const selectionSort = (arr) => {
    const n = arr.length;
    const sortedArr = [...arr];
    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      for (let j = i + 1; j < n; j++) {
        if (sortedArr[j] < sortedArr[minIdx]) {
          minIdx = j;
        }
      }
      if (minIdx !== i) {
        [sortedArr[i], sortedArr[minIdx]] = [sortedArr[minIdx], sortedArr[i]];
      }
    }
    return sortedArr;
  };

  const insertionSort = (arr) => {
    const sortedArr = [...arr];
    for (let i = 1; i < sortedArr.length; i++) {
      let key = sortedArr[i];
      let j = i - 1;
      while (j >= 0 && sortedArr[j] > key) {
        sortedArr[j + 1] = sortedArr[j];
        j--;
      }
      sortedArr[j + 1] = key;
    }
    return sortedArr;
  };

  const mergeSort = (arr) => {
    if (arr.length <= 1) return arr;

    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));

    return merge(left, right);
  };

  const merge = (left, right) => {
    const result = [];
    let i = 0,
      j = 0;

    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) {
        result.push(left[i]);
        i++;
      } else {
        result.push(right[j]);
        j++;
      }
    }

    return result.concat(left.slice(i)).concat(right.slice(j));
  };

  const quickSort = (arr) => {
    if (arr.length <= 1) return arr;

    const pivot = arr[Math.floor(arr.length / 2)];
    const left = arr.filter((x) => x < pivot);
    const middle = arr.filter((x) => x === pivot);
    const right = arr.filter((x) => x > pivot);

    return [...quickSort(left), ...middle, ...quickSort(right)];
  };

  // Generate random array
  const generateRandomArray = (size) => {
    return Array.from({ length: size }, () =>
      Math.floor(Math.random() * 10000)
    );
  };

  // Measure execution time
  const measureTime = (sortFunction, arr) => {
    const start = performance.now();
    sortFunction(arr);
    const end = performance.now();
    return (end - start).toFixed(3);
  };

  // Run all tests
  const runTests = async () => {
    setIsRunning(true);
    setResults([]);

    const inputSizes = [1000, 2000, 3000, 4000, 5000];
    const algorithms = [
      { name: "Bubble Sort", func: bubbleSort },
      { name: "Selection Sort", func: selectionSort },
      { name: "Insertion Sort", func: insertionSort },
      { name: "Merge Sort", func: mergeSort },
      { name: "Quick Sort", func: quickSort },
    ];

    const testResults = [];

    for (const size of inputSizes) {
      setCurrentTest(`Testing with ${size} elements...`);

      const testData = generateRandomArray(size);
      const sizeResult = { size };

      for (const algorithm of algorithms) {
        const time = measureTime(algorithm.func, testData);
        sizeResult[algorithm.name] = parseFloat(time);
      }

      testResults.push(sizeResult);
      setResults([...testResults]);

      // Small delay to show progress
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    setCurrentTest("");
    setIsRunning(false);
  };

  // Export results as CSV
  const exportToCsv = () => {
    if (results.length === 0) return;

    const headers = [
      "Input Size (n)",
      "Bubble Sort (ms)",
      "Selection Sort (ms)",
      "Insertion Sort (ms)",
      "Merge Sort (ms)",
      "Quick Sort (ms)",
    ];
    const csvContent = [
      headers.join(","),
      ...results.map((row) =>
        [
          row.size,
          row["Bubble Sort"],
          row["Selection Sort"],
          row["Insertion Sort"],
          row["Merge Sort"],
          row["Quick Sort"],
        ].join(",")
      ),
    ].join("\\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sorting_algorithm_comparison.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Sorting Algorithms Performance Analysis
          </h1>
          <p className="text-lg text-gray-600">
            Compare execution times of 5 different sorting algorithms
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4">
              <button
                onClick={runTests}
                disabled={isRunning}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <Play size={20} />
                {isRunning ? "Running Tests..." : "Run Performance Tests"}
              </button>

              {results.length > 0 && (
                <button
                  onClick={exportToCsv}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <Download size={20} />
                  Export CSV
                </button>
              )}
            </div>

            {currentTest && (
              <div className="flex items-center gap-2 text-blue-600">
                <Clock size={20} className="animate-spin" />
                <span className="font-medium">{currentTest}</span>
              </div>
            )}
          </div>
        </div>

        {/* Algorithm Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[
            {
              name: "Bubble Sort",
              complexity: "O(n²)",
              description:
                "Compares adjacent elements and swaps them if in wrong order",
            },
            {
              name: "Selection Sort",
              complexity: "O(n²)",
              description: "Finds minimum element and places it at beginning",
            },
            {
              name: "Insertion Sort",
              complexity: "O(n²)",
              description: "Builds sorted array one element at a time",
            },
            {
              name: "Merge Sort",
              complexity: "O(n log n)",
              description:
                "Divide and conquer approach with guaranteed performance",
            },
            {
              name: "Quick Sort",
              complexity: "O(n log n)",
              description: "Efficient divide and conquer with pivot selection",
            },
          ].map((algo, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-bold text-lg text-gray-800 mb-2">
                {algo.name}
              </h3>
              <p className="text-sm text-blue-600 font-mono mb-2">
                Time: {algo.complexity}
              </p>
              <p className="text-sm text-gray-600">{algo.description}</p>
            </div>
          ))}
        </div>

        {/* Results Table */}
        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            <div className="bg-gray-50 px-6 py-4 border-b">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <BarChart3 size={24} />
                Performance Results
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Input Size (n)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bubble Sort (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Selection Sort (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Insertion Sort (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Merge Sort (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quick Sort (ms)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.map((result, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {result.size.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-mono">
                        {result["Bubble Sort"]}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600 font-mono">
                        {result["Selection Sort"]}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 font-mono">
                        {result["Insertion Sort"]}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-mono">
                        {result["Merge Sort"]}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-mono">
                        {result["Quick Sort"]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analysis and Conclusion */}
        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Analysis & Conclusion
            </h2>

            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Performance Observations:
                </h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>
                    <strong>
                      O(n²) Algorithms (Bubble, Selection, Insertion):
                    </strong>{" "}
                    Show quadratic growth in execution time
                  </li>
                  <li>
                    <strong>O(n log n) Algorithms (Merge, Quick):</strong>{" "}
                    Demonstrate superior scalability
                  </li>
                  <li>
                    <strong>Merge Sort:</strong> Consistent performance with
                    guaranteed O(n log n) complexity
                  </li>
                  <li>
                    <strong>Quick Sort:</strong> Often fastest in practice
                    despite worst-case O(n²)
                  </li>
                  <li>
                    <strong>Insertion Sort:</strong> May outperform others on
                    small datasets due to low overhead
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Key Findings:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>
                    Execution time increases significantly for O(n²) algorithms
                    as input size grows
                  </li>
                  <li>
                    Merge Sort and Quick Sort maintain relatively stable
                    performance scaling
                  </li>
                  <li>
                    The difference becomes more pronounced with larger datasets
                  </li>
                  <li>
                    Algorithm choice should depend on input size and stability
                    requirements
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Recommendations:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>
                    <strong>Small datasets (n &lt; 100):</strong> Insertion Sort
                    for simplicity
                  </li>
                  <li>
                    <strong>Large datasets:</strong> Merge Sort for guaranteed
                    performance
                  </li>
                  <li>
                    <strong>General purpose:</strong> Quick Sort for
                    average-case efficiency
                  </li>
                  <li>
                    <strong>Memory constraints:</strong> In-place algorithms
                    like Quick Sort
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SortingComparison;
