/**
 * Jqery mandatory. 
 * 
 */

class BlockManager {
    constructor() {

    }

    #showed_blocks = [];

    showBlock(block_to_show) {
        block_to_show.show();
        this.#showed_blocks.push(block_to_show);
    }

    hideShowedBlocks() {
        if (this.#showed_blocks.length > 0) {
            this.#showed_blocks.hide();
        }
    }
}