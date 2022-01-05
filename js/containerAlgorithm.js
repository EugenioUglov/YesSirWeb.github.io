const containerAlgorithm = {};

containerAlgorithm.clearContentInContainer = function(container) {
    while (container.hasChildNodes()) {
        container.removeChild(container.lastChild);
    }
}  
